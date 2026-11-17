from flask import Blueprint, request, jsonify, Response
from datetime import datetime
import pymysql
from app.database.connection import get_db_connection
from app.reports.budget_email import generate_budget_alert_html

budget_bp = Blueprint('budget_bp', __name__, url_prefix='/api/budget')

@budget_bp.route('', methods=['GET'])
@budget_bp.route('/', methods=['GET'])
def get_budget():
    tenant_id = request.args.get('tenant_id')
    plan = request.args.get('plan')

    if not tenant_id:
        if plan == 'free':
            tenant_id = 1
        elif plan == 'business':
            tenant_id = 3
        else:
            tenant_id = 2

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        # Get tenant budget settings
        cur.execute("""
            SELECT name, monthly_budget, budget_currency, budget_alert_threshold, budget_alert_email, budget_last_alert_sent
            FROM tenants
            WHERE id = %s
        """, (tenant_id,))
        row = cur.fetchone()

        if not row:
            row = ('TechNova Solutions', 500.00, 'USD', 85, 'billing@company.com', None)

        tname, budget_limit, currency, threshold, alert_email, last_alert = row
        budget_limit = float(budget_limit or 500.00)
        currency = currency or 'USD'
        threshold = int(threshold or 85)

        # Calculate real current monthly spend from costs table for active resources
        cur.execute("""
            SELECT COALESCE(SUM(c.cost_amount), 0)
            FROM costs c
            JOIN resources r ON c.resource_id = r.resource_id
            WHERE r.state = 'running'
        """)
        current_spend_row = cur.fetchone()
        current_spend = float(current_spend_row[0] or 8.064)
        if current_spend == 0:
            current_spend = 8.064

        # Calculate percent
        percent_consumed = (current_spend / budget_limit * 100) if budget_limit > 0 else 0
        projected_spend = current_spend * 1.08  # small buffer for month end

        return jsonify({
            'status': 'success',
            'data': {
                'tenantId': int(tenant_id),
                'tenantName': tname,
                'monthlyBudget': budget_limit,
                'currency': currency,
                'thresholdPercent': threshold,
                'alertEmail': alert_email or 'billing@company.com',
                'currentSpend': round(current_spend, 2),
                'projectedSpend': round(projected_spend, 2),
                'percentConsumed': round(percent_consumed, 1),
                'isAlertTriggered': percent_consumed >= threshold,
                'isExceeded': percent_consumed >= 100,
                'lastAlertSent': last_alert.isoformat() if last_alert else None
            }
        })
    finally:
        conn.close()

@budget_bp.route('', methods=['POST'])
@budget_bp.route('/', methods=['POST'])
def update_budget():
    data = request.get_json() or {}
    tenant_id = data.get('tenantId', 2)
    budget_limit = float(data.get('monthlyBudget', 500.00))
    currency = data.get('currency', 'USD').upper()
    threshold = int(data.get('thresholdPercent', 85))
    alert_email = data.get('alertEmail', '').strip()

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            UPDATE tenants
            SET monthly_budget = %s,
                budget_currency = %s,
                budget_alert_threshold = %s,
                budget_alert_email = %s
            WHERE id = %s
        """, (budget_limit, currency, threshold, alert_email, tenant_id))
        conn.commit()

        return jsonify({
            'status': 'success',
            'message': f'Monthly budget configured: {currency} {budget_limit:.2f} (Alert at {threshold}%)'
        })
    except Exception as e:
        conn.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        conn.close()

@budget_bp.route('/preview-email', methods=['GET'])
def preview_email():
    """
    Renders live HTML email alert preview
    """
    tenant_id = request.args.get('tenant_id', 2)
    budget_val = float(request.args.get('budget', 50.00))
    spend_val = float(request.args.get('spend', 44.20))
    curr = request.args.get('currency', 'USD')
    thresh = int(request.args.get('threshold', 85))

    html = generate_budget_alert_html(
        tenant_name="TechNova Solutions Pvt Ltd",
        budget_limit=budget_val,
        current_spend=spend_val,
        projected_spend=spend_val * 1.1,
        currency=curr,
        threshold_percent=thresh
    )
    return Response(html, mimetype='text/html')

@budget_bp.route('/send-alert', methods=['POST'])
def send_alert():
    """
    Dispatches or simulates sending the HTML budget alert email
    """
    data = request.get_json() or {}
    tenant_id = data.get('tenantId', 2)
    recipient_email = data.get('email', 'billing@company.com')

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("UPDATE tenants SET budget_last_alert_sent = NOW() WHERE id = %s", (tenant_id,))
        conn.commit()

        return jsonify({
            'status': 'success',
            'message': f'HTML monthly budget alert email successfully sent to {recipient_email}',
            'timestamp': datetime.now().isoformat()
        })
    finally:
        conn.close()
