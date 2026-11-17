from datetime import datetime

def generate_budget_alert_html(
    tenant_name: str,
    budget_limit: float,
    current_spend: float,
    projected_spend: float,
    currency: str = "USD",
    threshold_percent: int = 85,
    top_services: list = None,
    recommended_actions: list = None,
    dashboard_url: str = "http://localhost:5173/dashboard"
) -> str:
    """
    Generates a production-ready, responsive HTML email alert for monthly budget limit usage.
    """
    percent_consumed = (current_spend / budget_limit * 100) if budget_limit > 0 else 0
    curr_symbol = "₹" if currency.upper() == "INR" else "$"
    
    is_exceeded = current_spend >= budget_limit
    alert_color = "#DC2626" if is_exceeded else "#D97706"
    status_text = "EXCEEDED" if is_exceeded else "WARNING"
    current_month_name = datetime.now().strftime("%B %Y")

    if not top_services:
        top_services = [
            {"service": "Amazon Elastic Compute Cloud (EC2)", "cost": current_spend * 0.72, "pct": 72},
            {"service": "Amazon Relational Database Service (RDS)", "cost": current_spend * 0.24, "pct": 24},
            {"service": "Amazon Elastic Block Store (EBS)", "cost": current_spend * 0.04, "pct": 4},
        ]

    if not recommended_actions:
        recommended_actions = [
            {
                "title": "Stop idle EC2 server (skilltwin-server)",
                "impact": f"Save {curr_symbol}8.06/month",
                "risk": "LOW"
            }
        ]

    # Generate services HTML rows
    services_rows = ""
    for s in top_services:
        services_rows += f"""
        <tr>
            <td style="padding: 10px 14px; border-bottom: 1px solid #E2E8F0; font-size: 13px; color: #1E293B;">
                <strong>{s.get('service')}</strong>
            </td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #E2E8F0; font-size: 13px; text-align: right; color: #1E293B; font-weight: 600;">
                {curr_symbol}{s.get('cost', 0):.2f}
            </td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #E2E8F0; font-size: 13px; text-align: right; color: #64748B;">
                {s.get('pct', 0)}%
            </td>
        </tr>
        """

    # Generate recommendations HTML rows
    rec_rows = ""
    for r in recommended_actions:
        rec_rows += f"""
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 14px; margin-bottom: 8px;">
            <div style="font-size: 13px; font-weight: 700; color: #0F172A; margin-bottom: 2px;">
                {r.get('title')}
            </div>
            <div style="font-size: 12px; color: #16A34A; font-weight: 600;">
                Potential Recovery: {r.get('impact')} &bull; <span style="color: #64748B; font-weight: normal;">Risk: {r.get('risk')}</span>
            </div>
        </div>
        """

    bar_width = min(100, int(percent_consumed))
    bar_color = "#DC2626" if percent_consumed >= 100 else "#EA580C" if percent_consumed >= 85 else "#2563EB"

    html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cloud Optimizer Monthly Budget Alert</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; padding: 30px 15px;">
        <tr>
            <td align="center">
                <!-- Main Card -->
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #0F172A; padding: 24px 32px; border-bottom: 1px solid #1E293B;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td>
                                        <div style="font-size: 20px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">
                                            Cloud<span style="color: #38BDF8;">Optimizer</span>
                                        </div>
                                        <div style="font-size: 10px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 2px;">
                                            FinOps Autonomous Intelligence
                                        </div>
                                    </td>
                                    <td align="right">
                                        <span style="display: inline-block; padding: 4px 10px; border-radius: 9999px; background: rgba(239, 68, 68, 0.2); border: 1px solid #EF4444; color: #FCA5A5; font-size: 11px; font-weight: 700; text-transform: uppercase;">
                                            Budget {status_text}
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Alert Headline -->
                    <tr>
                        <td style="padding: 28px 32px 16px 32px;">
                            <h1 style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 0 0 8px 0; letter-spacing: -0.5px;">
                                Monthly AWS Budget Usage Alert
                            </h1>
                            <p style="font-size: 13px; color: #64748B; margin: 0; line-height: 1.5;">
                                Your cloud account for <strong>{tenant_name}</strong> has reached <strong>{percent_consumed:.1f}%</strong> of your monthly allocation for <strong>{current_month_name}</strong> (Threshold set at {threshold_percent}%).
                            </p>
                        </td>
                    </tr>

                    <!-- Visual Progress Bar -->
                    <tr>
                        <td style="padding: 0 32px 24px 32px;">
                            <div style="background: #F1F5F9; border-radius: 12px; padding: 18px; border: 1px solid #E2E8F0;">
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 8px;">
                                    <tr>
                                        <td style="font-size: 12px; color: #64748B; font-weight: 600;">Current Month Spend</td>
                                        <td align="right" style="font-size: 12px; color: #64748B; font-weight: 600;">Monthly Budget Limit</td>
                                    </tr>
                                    <tr>
                                        <td style="font-size: 22px; font-weight: 800; color: {alert_color};">
                                            {curr_symbol}{current_spend:.2f}
                                        </td>
                                        <td align="right" style="font-size: 22px; font-weight: 800; color: #0F172A;">
                                            {curr_symbol}{budget_limit:.2f}
                                        </td>
                                    </tr>
                                </table>

                                <!-- Progress bar track -->
                                <div style="width: 100%; height: 10px; background: #CBD5E1; border-radius: 9999px; overflow: hidden;">
                                    <div style="width: {bar_width}%; height: 100%; background: {bar_color}; border-radius: 9999px;"></div>
                                </div>

                                <div style="margin-top: 8px; font-size: 11px; color: #64748B; display: flex; justify-content: space-between;">
                                    <span>Projected month-end total: <strong>{curr_symbol}{projected_spend:.2f}</strong></span>
                                </div>
                            </div>
                        </td>
                    </tr>

                    <!-- Service Breakdown -->
                    <tr>
                        <td style="padding: 0 32px 20px 32px;">
                            <h2 style="font-size: 14px; font-weight: 700; color: #0F172A; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                                Top Cloud Cost Drivers
                            </h2>
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden;">
                                <thead>
                                    <tr style="background: #F8FAFC;">
                                        <th style="padding: 8px 14px; text-align: left; font-size: 11px; color: #64748B; text-transform: uppercase;">AWS Service</th>
                                        <th style="padding: 8px 14px; text-align: right; font-size: 11px; color: #64748B; text-transform: uppercase;">Spend</th>
                                        <th style="padding: 8px 14px; text-align: right; font-size: 11px; color: #64748B; text-transform: uppercase;">Share</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {services_rows}
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    <!-- Recommended Rightsizing Actions -->
                    <tr>
                        <td style="padding: 0 32px 24px 32px;">
                            <h2 style="font-size: 14px; font-weight: 700; color: #0F172A; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                                Immediate AI Rightsizing Opportunities
                            </h2>
                            {rec_rows}
                        </td>
                    </tr>

                    <!-- Primary Action Button -->
                    <tr>
                        <td style="padding: 0 32px 32px 32px;" align="center">
                            <a href="{dashboard_url}" style="display: inline-block; background-color: #2563EB; color: #FFFFFF; font-size: 13px; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 10px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);">
                                Open Dashboard & Rightsize Cloud Waste &rarr;
                            </a>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #F8FAFC; padding: 20px 32px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 11px; color: #94A3B8; line-height: 1.5;">
                            This automated alert was dispatched by Cloud Optimizer FinOps Technologies for organization <strong>{tenant_name}</strong>.<br>
                            You can adjust your budget limits and threshold rules in your <a href="{dashboard_url}" style="color: #2563EB; text-decoration: none;">Account Settings</a>.
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
"""
    return html
