from flask import Blueprint, jsonify, render_template, send_file
from app.analysis import run_analysis
from app.database.connection import get_db_connection


dashboard_bp = Blueprint("dashboard", __name__)


# ============================================================
# FRONTEND PAGES
# ============================================================

@dashboard_bp.route("/")
def dashboard():
    return render_template("dashboard.html")


@dashboard_bp.route("/resources")
def resources_page():
    return render_template("resources.html")


@dashboard_bp.route("/recommendations")
def recommendations_page():
    return render_template("recommendations.html")


@dashboard_bp.route("/actions")
def actions_page():
    return render_template("actions.html")


@dashboard_bp.route("/reports")
def reports_page():
    return render_template("reports.html")


# ============================================================
# HEALTH
# ============================================================

@dashboard_bp.route("/api/health")
def health():

    return jsonify({
        "status": "ok",
        "service": "Cloud Cost Optimization API"
    })


# ============================================================
# DASHBOARD SUMMARY KPI API
# ============================================================

@dashboard_bp.route("/api/dashboard/summary")
def dashboard_summary_api():

    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Total resources count & types
    cursor.execute("SELECT COUNT(*), resource_type FROM resources GROUP BY resource_type")
    res_rows = cursor.fetchall()
    total_resources = sum(r[0] for r in res_rows)
    resource_breakdown = {r[1]: r[0] for r in res_rows}

    # 2. Recommendations summary
    cursor.execute("""
        SELECT COUNT(*), COALESCE(SUM(estimated_savings), 0)
        FROM recommendations
        WHERE status = 'pending'
    """)
    rec_tuple = cursor.fetchone()
    rec_count = rec_tuple[0] if rec_tuple else 0
    total_savings = rec_tuple[1] if rec_tuple else 0

    # 3. Actions count
    cursor.execute("SELECT COUNT(*) FROM actions")
    actions_count = cursor.fetchone()[0]

    # 4. Latest analysis run
    cursor.execute("""
        SELECT id, started_at, completed_at, status, estimated_savings
        FROM analysis_runs
        ORDER BY id DESC
        LIMIT 1
    """)
    last_run = cursor.fetchone()
    last_run_data = None
    if last_run:
        last_run_data = {
            "id": last_run[0],
            "started_at": last_run[1].isoformat() if last_run[1] else None,
            "completed_at": last_run[2].isoformat() if last_run[2] else None,
            "status": last_run[3],
            "estimated_savings": float(last_run[4] or 0)
        }

    cursor.close()
    conn.close()

    return jsonify({
        "status": "success",
        "data": {
            "total_resources": total_resources,
            "resource_breakdown": resource_breakdown,
            "pending_recommendations": rec_count or 0,
            "potential_monthly_savings_usd": float(total_savings or 0),
            "executed_actions_count": actions_count or 0,
            "latest_run": last_run_data
        }
    })


# ============================================================
# APPROVE RECOMMENDATION
# ============================================================

@dashboard_bp.route("/api/recommendations/<int:rec_id>/approve", methods=["POST"])
def approve_recommendation_api(rec_id):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT resource_id, recommendation_type, recommendation, risk_level, estimated_savings
        FROM recommendations
        WHERE id = %s
    """, (rec_id,))
    rec = cursor.fetchone()

    if not rec:
        cursor.close()
        conn.close()
        return jsonify({"status": "error", "message": "Recommendation not found"}), 404

    resource_id, rec_type, reason, risk, savings = rec

    # Queue in actions table
    cursor.execute("""
        INSERT INTO actions (resource_id, action_type, action_status, reason, risk_level, created_at)
        VALUES (%s, %s, 'approved', %s, %s, CURRENT_TIMESTAMP)
    """, (resource_id, rec_type, reason, risk))

    # Mark recommendation as approved
    cursor.execute("UPDATE recommendations SET status = 'approved' WHERE id = %s", (rec_id,))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({
        "status": "success",
        "message": f"Recommendation #{rec_id} approved. Action queued for execution."
    })


# ============================================================
# REJECT RECOMMENDATION
# ============================================================

@dashboard_bp.route("/api/recommendations/<int:rec_id>/reject", methods=["POST"])
def reject_recommendation_api(rec_id):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("UPDATE recommendations SET status = 'rejected' WHERE id = %s", (rec_id,))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({
        "status": "success",
        "message": f"Recommendation #{rec_id} marked as rejected."
    })


# ============================================================
# RUN ANALYSIS
# ============================================================

@dashboard_bp.route("/api/run-analysis", methods=["POST"])
def run_analysis_api():

    try:

        result = run_analysis()

        return jsonify({
            "status": "success",
            "message": "Cloud cost analysis completed successfully.",
            "data": result
        })

    except Exception as e:

        print("Analysis error:", str(e))

        return jsonify({
            "status": "error",
            "message": "Analysis failed.",
            "error": str(e)
        }), 500


# ============================================================
# RESOURCES API
# ============================================================

@dashboard_bp.route("/api/resources")
def resources_api():

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            resource_id,
            resource_type,
            resource_name,
            region,
            state,
            instance_type,
            last_seen_at
        FROM resources
        ORDER BY resource_type, resource_id
    """)

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    resources = []

    for row in rows:

        resources.append({
            "resource_id": row[0],
            "resource_type": row[1],
            "resource_name": row[2],
            "region": row[3],
            "state": row[4],
            "instance_type": row[5],
            "last_seen_at": (
                row[6].isoformat()
                if row[6]
                else None
            )
        })

    return jsonify({
        "status": "success",
        "data": resources
    })


# ============================================================
# RECOMMENDATIONS API
# ============================================================

@dashboard_bp.route("/api/recommendations")
def recommendations_api():

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            id,
            resource_id,
            recommendation_type,
            recommendation,
            estimated_savings,
            risk_level,
            confidence,
            status
        FROM recommendations
        WHERE status = 'pending'
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    recommendations = []

    for row in rows:

        recommendations.append({
            "id": row[0],
            "resource_id": row[1],
            "recommendation_type": row[2],
            "recommendation": row[3],
            "estimated_savings": float(row[4] or 0),
            "risk_level": row[5],
            "confidence": float(row[6] or 0),
            "status": row[7]
        })

    return jsonify({
        "status": "success",
        "data": recommendations
    })


# ============================================================
# ACTIONS API
# ============================================================

@dashboard_bp.route("/api/actions")
def actions_api():

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            id,
            resource_id,
            action_type,
            action_status,
            reason,
            risk_level,
            executed_at,
            created_at
        FROM actions
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    actions = []

    for row in rows:

        actions.append({
            "id": row[0],
            "resource_id": row[1],
            "action_type": row[2],
            "action_status": row[3],
            "reason": row[4],
            "risk_level": row[5],
            "executed_at": (
                row[6].isoformat()
                if row[6]
                else None
            ),
            "created_at": (
                row[7].isoformat()
                if row[7]
                else None
            )
        })

    return jsonify({
        "status": "success",
        "data": actions
    })


# ============================================================
# REPORTS API
# ============================================================

@dashboard_bp.route("/api/reports")
def reports_api():

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            id,
            started_at,
            completed_at,
            status,
            resources_analyzed,
            recommendations_generated,
            estimated_savings,
            report_path,
            error_message
        FROM analysis_runs
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    reports = []

    for row in rows:

        reports.append({
            "id": row[0],
            "started_at": (
                row[1].isoformat()
                if row[1]
                else None
            ),
            "completed_at": (
                row[2].isoformat()
                if row[2]
                else None
            ),
            "status": row[3],
            "resources_analyzed": row[4],
            "recommendations_generated": row[5],
            "estimated_savings": float(row[6] or 0),
            "report_path": row[7],
            "error_message": row[8]
        })

    return jsonify({
        "status": "success",
        "data": reports
    })

# ============================================================
# DOWNLOAD LATEST PDF REPORT
# ============================================================

@dashboard_bp.route("/api/reports/latest/pdf")
def download_latest_pdf():

    import os

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT report_path
        FROM analysis_runs
        WHERE status = 'completed'
          AND report_path IS NOT NULL
        ORDER BY id DESC
        LIMIT 1
    """)

    row = cursor.fetchone()

    cursor.close()
    conn.close()

    if not row:
        return jsonify({
            "status": "error",
            "message": "No completed report found."
        }), 404

    report_path = row[0]

    if not os.path.exists(report_path):
        return jsonify({
            "status": "error",
            "message": "Report file does not exist.",
            "path": report_path
        }), 404

    return send_file(
        report_path,
        as_attachment=True,
        download_name=os.path.basename(report_path),
        mimetype="application/pdf"
    )
