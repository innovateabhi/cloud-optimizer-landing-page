from html import escape


def generate_html_report(report_data):
    """
    Generate a complete HTML report from analysis data.
    """

    run_id = report_data.get("run_id", "N/A")
    generated_at = report_data.get("generated_at", "N/A")
    region = report_data.get("region", "N/A")

    resources = report_data.get("resources", [])
    costs = report_data.get("costs", [])
    recommendations = report_data.get("recommendations", [])
    actions = report_data.get("actions", [])

    total_monthly_cost = report_data.get(
        "total_monthly_cost", 0
    )

    total_savings = report_data.get(
        "total_estimated_savings", 0
    )

    html = f"""
<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport"
      content="width=device-width, initial-scale=1.0">

<title>AWS Cloud Cost Optimization Report</title>

<style>

body {{
    font-family: Arial, sans-serif;
    background: #f4f6f8;
    margin: 0;
    padding: 30px;
    color: #1f2937;
}}

.container {{
    max-width: 1200px;
    margin: auto;
    background: white;
    padding: 35px;
    border-radius: 12px;
}}

h1 {{
    margin-bottom: 5px;
}}

h2 {{
    margin-top: 35px;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 8px;
}}

.subtitle {{
    color: #6b7280;
}}

.summary {{
    display: grid;
    grid-template-columns:
        repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-top: 25px;
}}

.card {{
    background: #f8fafc;
    border: 1px solid #e5e7eb;
    padding: 20px;
    border-radius: 10px;
}}

.card-title {{
    color: #6b7280;
    font-size: 14px;
}}

.card-value {{
    font-size: 26px;
    font-weight: bold;
    margin-top: 8px;
}}

table {{
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
}}

th, td {{
    border: 1px solid #e5e7eb;
    padding: 10px;
    text-align: left;
}}

th {{
    background: #f3f4f6;
}}

.badge {{
    padding: 5px 9px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: bold;
}}

.high {{
    background: #fee2e2;
    color: #991b1b;
}}

.medium {{
    background: #fef3c7;
    color: #92400e;
}}

.low {{
    background: #dcfce7;
    color: #166534;
}}

.executed {{
    color: #166534;
    font-weight: bold;
}}

.pending {{
    color: #92400e;
    font-weight: bold;
}}

.footer {{
    margin-top: 40px;
    color: #6b7280;
    font-size: 13px;
    text-align: center;
}}

</style>

</head>

<body>

<div class="container">

<h1>AWS Cloud Cost Optimization Report</h1>

<div class="subtitle">
Analysis Run #{run_id}
</div>

<div class="subtitle">
Generated: {escape(str(generated_at))}
</div>

<div class="subtitle">
AWS Region: {escape(str(region))}
</div>


<!-- SUMMARY -->

<h2>Executive Summary</h2>

<div class="summary">

<div class="card">

<div class="card-title">
Resources Analyzed
</div>

<div class="card-value">
{len(resources)}
</div>

</div>


<div class="card">

<div class="card-title">
Monthly Estimated Cost
</div>

<div class="card-value">
${total_monthly_cost:.2f}
</div>

</div>


<div class="card">

<div class="card-title">
Potential Monthly Savings
</div>

<div class="card-value">
${total_savings:.2f}
</div>

</div>


<div class="card">

<div class="card-title">
Recommendations
</div>

<div class="card-value">
{len(recommendations)}
</div>

</div>

</div>


<!-- RESOURCES -->

<h2>Resources</h2>

<table>

<tr>

<th>Name</th>
<th>Type</th>
<th>Region</th>
<th>State</th>
<th>Instance Type</th>

</tr>
"""

    for resource in resources:

        name = resource.get(
            "resource_name",
            resource.get("instance_id", "N/A")
        )

        resource_type = resource.get(
            "resource_type",
            "EC2"
        )

        state = resource.get(
            "state",
            "N/A"
        )

        instance_type = resource.get(
            "instance_type",
            "-"
        )

        resource_region = resource.get(
            "region",
            region
        )

        html += f"""
<tr>

<td>{escape(str(name))}</td>

<td>{escape(str(resource_type))}</td>

<td>{escape(str(resource_region))}</td>

<td>{escape(str(state))}</td>

<td>{escape(str(instance_type))}</td>

</tr>
"""


    html += """

</table>


<!-- COSTS -->

<h2>Cost Analysis</h2>

<table>

<tr>

<th>Resource</th>
<th>Service</th>
<th>Region</th>
<th>Hourly Cost</th>
<th>Daily Cost</th>
<th>Monthly Cost</th>

</tr>
"""


    for cost in costs:

        html += f"""
<tr>

<td>
{escape(str(cost.get("resource_id", "N/A")))}
</td>

<td>
{escape(str(cost.get("service", "N/A")))}
</td>

<td>
{escape(str(cost.get("region", "N/A")))}
</td>

<td>
${float(cost.get("hourly_cost", 0)):.4f}
</td>

<td>
${float(cost.get("daily_cost", 0)):.4f}
</td>

<td>
${float(cost.get("monthly_cost", 0)):.2f}
</td>

</tr>
"""


    html += """

</table>


<!-- RECOMMENDATIONS -->

<h2>Optimization Recommendations</h2>

<table>

<tr>

<th>Resource</th>
<th>Recommendation</th>
<th>Action</th>
<th>Risk</th>
<th>Confidence</th>
<th>Estimated Savings</th>

</tr>
"""


    for recommendation in recommendations:

        risk = str(
            recommendation.get(
                "risk_level",
                "LOW"
            )
        ).upper()

        risk_class = risk.lower()

        html += f"""
<tr>

<td>
{escape(str(
    recommendation.get(
        "resource_id",
        "N/A"
    )
))}
</td>

<td>
{escape(str(
    recommendation.get(
        "recommendation",
        "N/A"
    )
))}
</td>

<td>
{escape(str(
    recommendation.get(
        "action",
        recommendation.get(
            "recommendation_type",
            "N/A"
        )
    )
))}
</td>

<td>

<span class="badge {risk_class}">
{escape(risk)}
</span>

</td>

<td>
{float(
    recommendation.get(
        "confidence",
        0
    )
):.0f}%
</td>

<td>
${float(
    recommendation.get(
        "estimated_savings",
        0
    )
):.2f}
</td>

</tr>
"""


    html += """

</table>


<!-- ACTIONS -->

<h2>Execution History</h2>

<table>

<tr>

<th>Resource</th>
<th>Action</th>
<th>Status</th>
<th>Risk</th>
<th>Reason</th>
<th>Executed At</th>

</tr>
"""


    for action in actions:

        status = str(
            action.get(
                "action_status",
                "N/A"
            )
        ).lower()

        status_class = status

        html += f"""
<tr>

<td>
{escape(str(
    action.get(
        "resource_id",
        "N/A"
    )
))}
</td>

<td>
{escape(str(
    action.get(
        "action_type",
        "N/A"
    )
))}
</td>

<td class="{status_class}">
{escape(status.upper())}
</td>

<td>
{escape(str(
    action.get(
        "risk_level",
        "N/A"
    )
))}
</td>

<td>
{escape(str(
    action.get(
        "reason",
        ""
    )
))}
</td>

<td>
{escape(str(
    action.get(
        "executed_at",
        "-"
    )
))}
</td>

</tr>
"""


    html += """

</table>


<div class="footer">

Generated by Cloud Cost Optimization Agent

</div>

</div>

</body>

</html>
"""

    return html
