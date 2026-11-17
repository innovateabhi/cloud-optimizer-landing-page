from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak
)


def generate_pdf_report(report_data, output_path):
    """
    Generate a PDF report from report_data.
    """

    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=15 * mm,
        leftMargin=15 * mm,
        topMargin=15 * mm,
        bottomMargin=15 * mm
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Title"],
        alignment=TA_CENTER,
        fontSize=20,
        spaceAfter=8
    )

    subtitle_style = ParagraphStyle(
        "Subtitle",
        parent=styles["Normal"],
        alignment=TA_CENTER,
        fontSize=9,
        textColor=colors.grey,
        spaceAfter=4
    )

    heading_style = ParagraphStyle(
        "SectionHeading",
        parent=styles["Heading2"],
        fontSize=14,
        spaceBefore=15,
        spaceAfter=8
    )

    normal_style = ParagraphStyle(
        "NormalReport",
        parent=styles["Normal"],
        fontSize=8,
        leading=11
    )

    story = []

    run_id = report_data.get("run_id", "N/A")
    generated_at = report_data.get("generated_at", "N/A")
    region = report_data.get("region", "N/A")

    resources = report_data.get("resources", [])
    costs = report_data.get("costs", [])
    recommendations = report_data.get(
        "recommendations", []
    )
    actions = report_data.get("actions", [])

    total_monthly_cost = float(
        report_data.get(
            "total_monthly_cost",
            0
        ) or 0
    )

    total_savings = float(
        report_data.get(
            "total_estimated_savings",
            0
        ) or 0
    )

    # --------------------------------------------------
    # TITLE
    # --------------------------------------------------

    story.append(
        Paragraph(
            "AWS Cloud Cost Optimization Report",
            title_style
        )
    )

    story.append(
        Paragraph(
            f"Analysis Run #{run_id}",
            subtitle_style
        )
    )

    story.append(
        Paragraph(
            f"Generated: {generated_at}",
            subtitle_style
        )
    )

    story.append(
        Paragraph(
            f"AWS Region: {region}",
            subtitle_style
        )
    )

    story.append(Spacer(1, 10))

    # --------------------------------------------------
    # EXECUTIVE SUMMARY
    # --------------------------------------------------

    story.append(
        Paragraph(
            "Executive Summary",
            heading_style
        )
    )

    summary_data = [
        [
            "Resources",
            "Monthly Cost",
            "Potential Savings",
            "Recommendations"
        ],
        [
            str(len(resources)),
            f"${total_monthly_cost:.2f}",
            f"${total_savings:.2f}",
            str(len(recommendations))
        ]
    ]

    summary_table = Table(
        summary_data,
        colWidths=[
            40 * mm,
            40 * mm,
            45 * mm,
            40 * mm
        ]
    )

    summary_table.setStyle(
        TableStyle([
            (
                "BACKGROUND",
                (0, 0),
                (-1, 0),
                colors.HexColor("#e5e7eb")
            ),
            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.5,
                colors.grey
            ),
            (
                "ALIGN",
                (0, 0),
                (-1, -1),
                "CENTER"
            ),
            (
                "FONTNAME",
                (0, 0),
                (-1, 0),
                "Helvetica-Bold"
            ),
            (
                "FONTNAME",
                (0, 1),
                (-1, 1),
                "Helvetica-Bold"
            ),
            (
                "FONTSIZE",
                (0, 0),
                (-1, -1),
                8
            ),
            (
                "BOTTOMPADDING",
                (0, 0),
                (-1, -1),
                8
            ),
            (
                "TOPPADDING",
                (0, 0),
                (-1, -1),
                8
            )
        ])
    )

    story.append(summary_table)

    # --------------------------------------------------
    # RESOURCES
    # --------------------------------------------------

    story.append(
        Paragraph(
            "Resources",
            heading_style
        )
    )

    resource_table = [
        [
            "Name",
            "Type",
            "Region",
            "State",
            "Instance Type"
        ]
    ]

    for resource in resources:

        name = resource.get(
            "resource_name",
            resource.get(
                "instance_id",
                "N/A"
            )
        )

        resource_table.append([
            str(name),
            str(
                resource.get(
                    "resource_type",
                    "EC2"
                )
            ),
            str(
                resource.get(
                    "region",
                    region
                )
            ),
            str(
                resource.get(
                    "state",
                    "N/A"
                )
            ),
            str(
                resource.get(
                    "instance_type",
                    "-"
                )
            )
        ])

    table = Table(
        resource_table,
        repeatRows=1
    )

    table.setStyle(
        TableStyle([
            (
                "BACKGROUND",
                (0, 0),
                (-1, 0),
                colors.HexColor("#e5e7eb")
            ),
            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.4,
                colors.grey
            ),
            (
                "FONTNAME",
                (0, 0),
                (-1, 0),
                "Helvetica-Bold"
            ),
            (
                "FONTSIZE",
                (0, 0),
                (-1, -1),
                7
            ),
            (
                "VALIGN",
                (0, 0),
                (-1, -1),
                "TOP"
            )
        ])
    )

    story.append(table)

    # --------------------------------------------------
    # COST ANALYSIS
    # --------------------------------------------------

    story.append(
        Paragraph(
            "Cost Analysis",
            heading_style
        )
    )

    cost_table = [
        [
            "Resource",
            "Service",
            "Region",
            "Hourly",
            "Daily",
            "Monthly"
        ]
    ]

    for cost in costs:

        cost_table.append([
            str(
                cost.get(
                    "resource_id",
                    "N/A"
                )
            ),
            str(
                cost.get(
                    "service",
                    "N/A"
                )
            ),
            str(
                cost.get(
                    "region",
                    "N/A"
                )
            ),
            f"${float(cost.get('hourly_cost', 0)):.4f}",
            f"${float(cost.get('daily_cost', 0)):.4f}",
            f"${float(cost.get('monthly_cost', 0)):.2f}"
        ])

    table = Table(
        cost_table,
        repeatRows=1
    )

    table.setStyle(
        TableStyle([
            (
                "BACKGROUND",
                (0, 0),
                (-1, 0),
                colors.HexColor("#e5e7eb")
            ),
            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.4,
                colors.grey
            ),
            (
                "FONTNAME",
                (0, 0),
                (-1, 0),
                "Helvetica-Bold"
            ),
            (
                "FONTSIZE",
                (0, 0),
                (-1, -1),
                7
            )
        ])
    )

    story.append(table)

    # --------------------------------------------------
    # RECOMMENDATIONS
    # --------------------------------------------------

    story.append(
        Paragraph(
            "Optimization Recommendations",
            heading_style
        )
    )

    recommendation_table = [
        [
            "Resource",
            "Action",
            "Risk",
            "Confidence",
            "Savings"
        ]
    ]

    for recommendation in recommendations:

        recommendation_table.append([
            str(
                recommendation.get(
                    "resource_id",
                    "N/A"
                )
            ),
            str(
                recommendation.get(
                    "action",
                    recommendation.get(
                        "recommendation_type",
                        "N/A"
                    )
                )
            ),
            str(
                recommendation.get(
                    "risk_level",
                    "N/A"
                )
            ),
            f"{float(
                recommendation.get(
                    "confidence",
                    0
                )
            ):.0f}%",
            f"${float(
                recommendation.get(
                    "estimated_savings",
                    0
                )
            ):.2f}"
        ])

    table = Table(
        recommendation_table,
        repeatRows=1
    )

    table.setStyle(
        TableStyle([
            (
                "BACKGROUND",
                (0, 0),
                (-1, 0),
                colors.HexColor("#e5e7eb")
            ),
            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.4,
                colors.grey
            ),
            (
                "FONTNAME",
                (0, 0),
                (-1, 0),
                "Helvetica-Bold"
            ),
            (
                "FONTSIZE",
                (0, 0),
                (-1, -1),
                7
            )
        ])
    )

    story.append(table)

    # --------------------------------------------------
    # DETAILED RECOMMENDATIONS
    # --------------------------------------------------

    story.append(
        Paragraph(
            "Recommendation Details",
            heading_style
        )
    )

    for recommendation in recommendations:

        resource_id = recommendation.get(
            "resource_id",
            "N/A"
        )

        recommendation_text = recommendation.get(
            "recommendation",
            "N/A"
        )

        story.append(
            Paragraph(
                f"<b>{resource_id}</b>: "
                f"{recommendation_text}",
                normal_style
            )
        )

        story.append(Spacer(1, 5))

    # --------------------------------------------------
    # EXECUTION HISTORY
    # --------------------------------------------------

    story.append(
        Paragraph(
            "Execution History",
            heading_style
        )
    )

    action_table = [
        [
            "Resource",
            "Action",
            "Status",
            "Risk",
            "Executed At"
        ]
    ]

    for action in actions:

        action_table.append([
            str(
                action.get(
                    "resource_id",
                    "N/A"
                )
            ),
            str(
                action.get(
                    "action_type",
                    "N/A"
                )
            ),
            str(
                action.get(
                    "action_status",
                    "N/A"
                )
            ),
            str(
                action.get(
                    "risk_level",
                    "N/A"
                )
            ),
            str(
                action.get(
                    "executed_at",
                    "-"
                )
            )
        ])

    table = Table(
        action_table,
        repeatRows=1
    )

    table.setStyle(
        TableStyle([
            (
                "BACKGROUND",
                (0, 0),
                (-1, 0),
                colors.HexColor("#e5e7eb")
            ),
            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.4,
                colors.grey
            ),
            (
                "FONTNAME",
                (0, 0),
                (-1, 0),
                "Helvetica-Bold"
            ),
            (
                "FONTSIZE",
                (0, 0),
                (-1, -1),
                7
            )
        ])
    )

    story.append(table)

    # --------------------------------------------------
    # FOOTER
    # --------------------------------------------------

    story.append(Spacer(1, 20))

    story.append(
        Paragraph(
            "Generated by Cloud Cost Optimization Agent",
            subtitle_style
        )
    )

    doc.build(story)

    return output_path
