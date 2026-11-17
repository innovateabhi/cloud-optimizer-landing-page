from datetime import datetime
from pathlib import Path

from app.config import AWS_REGION
from app.database.connection import get_db_connection, is_mysql

from app.reports.html_generator import generate_html_report
from app.reports.pdf_generator import generate_pdf_report


REPORT_DIRECTORY = Path(
    "app/reports/generated"
)


def create_analysis_run():

    conn = get_db_connection()
    cursor = conn.cursor()

    if is_mysql():
        cursor.execute(
            """
            INSERT INTO analysis_runs
            (status, started_at)
            VALUES ('running', CURRENT_TIMESTAMP)
            """
        )
        run_id = cursor.lastrowid
    else:
        cursor.execute(
            """
            INSERT INTO analysis_runs
            (status, started_at)
            VALUES ('running', CURRENT_TIMESTAMP)
            RETURNING id
            """
        )
        run_id = cursor.fetchone()[0]

    conn.commit()

    cursor.close()
    conn.close()

    return run_id


def collect_resources():

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            resource_id,
            resource_type,
            resource_name,
            region,
            state,
            instance_type,
            engine
        FROM resources
        ORDER BY resource_type, resource_id
        """
    )

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    resources = []

    for row in rows:

        (
            resource_id,
            resource_type,
            resource_name,
            region,
            state,
            instance_type,
            engine
        ) = row

        resources.append({
            "resource_id": resource_id,
            "resource_type": resource_type,
            "resource_name": resource_name,
            "region": region,
            "state": state,
            "instance_type": instance_type,
            "engine": engine
        })

    return resources


def collect_costs():

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            resource_id,
            service,
            region,
            cost_amount
        FROM costs
        WHERE id IN (
            SELECT MAX(id)
            FROM costs
            GROUP BY resource_id
        )
        ORDER BY resource_id
        """
    )

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    costs = []

    for row in rows:

        (
            resource_id,
            service,
            region,
            monthly_cost
        ) = row

        monthly_cost = float(
            monthly_cost or 0
        )

        costs.append({
            "resource_id": resource_id,
            "service": service,
            "region": region,
            "hourly_cost": monthly_cost / 30 / 24,
            "daily_cost": monthly_cost / 30,
            "monthly_cost": monthly_cost
        })

    return costs


def collect_recommendations():

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            id,
            resource_id,
            recommendation_type,
            recommendation,
            estimated_savings,
            risk_level,
            confidence
        FROM recommendations
        WHERE status = 'pending'
        ORDER BY id
        """
    )

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    recommendations = []

    for row in rows:

        (
            recommendation_id,
            resource_id,
            recommendation_type,
            recommendation,
            estimated_savings,
            risk_level,
            confidence
        ) = row

        recommendations.append({
            "recommendation_id": recommendation_id,
            "resource_id": resource_id,
            "recommendation_type": recommendation_type,
            "recommendation": recommendation,
            "action": recommendation_type,
            "estimated_savings": float(
                estimated_savings or 0
            ),
            "risk_level": risk_level,
            "confidence": float(
                confidence or 0
            )
        })

    return recommendations


def collect_actions():

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            resource_id,
            action_type,
            action_status,
            reason,
            risk_level,
            executed_at,
            created_at
        FROM actions
        ORDER BY id DESC
        """
    )

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    actions = []

    for row in rows:

        (
            resource_id,
            action_type,
            action_status,
            reason,
            risk_level,
            executed_at,
            created_at
        ) = row

        actions.append({
            "resource_id": resource_id,
            "action_type": action_type,
            "action_status": action_status,
            "reason": reason,
            "risk_level": risk_level,
            "executed_at": executed_at,
            "created_at": created_at
        })

    return actions


def generate_report():

    print("\n")
    print("=" * 60)
    print("REPORT GENERATION AGENT")
    print("=" * 60)

    REPORT_DIRECTORY.mkdir(
        parents=True,
        exist_ok=True
    )

    # --------------------------------------------------
    # CREATE ANALYSIS RUN
    # --------------------------------------------------

    run_id = create_analysis_run()

    print("Analysis Run:", run_id)

    try:

        # --------------------------------------------------
        # COLLECT DATA
        # --------------------------------------------------

        resources = collect_resources()
        costs = collect_costs()
        recommendations = collect_recommendations()
        actions = collect_actions()

        total_monthly_cost = sum(
            float(
                cost.get(
                    "monthly_cost",
                    0
                )
            )
            for cost in costs
        )

        total_savings = sum(
            float(
                recommendation.get(
                    "estimated_savings",
                    0
                )
            )
            for recommendation in recommendations
        )

        generated_at = datetime.now()

        report_data = {
            "run_id": run_id,
            "generated_at": generated_at,
            "region": AWS_REGION,

            "resources": resources,

            "costs": costs,

            "recommendations": recommendations,

            "actions": actions,

            "total_monthly_cost":
                total_monthly_cost,

            "total_estimated_savings":
                total_savings
        }

        # --------------------------------------------------
        # FILE PATHS
        # --------------------------------------------------

        html_path = (
            REPORT_DIRECTORY /
            f"cloud_cost_report_{run_id}.html"
        )

        pdf_path = (
            REPORT_DIRECTORY /
            f"cloud_cost_report_{run_id}.pdf"
        )

        # --------------------------------------------------
        # GENERATE HTML
        # --------------------------------------------------

        html_path.write_text(
            generate_html_report(
                report_data
            ),
            encoding="utf-8"
        )

        # --------------------------------------------------
        # GENERATE PDF
        # --------------------------------------------------

        generate_pdf_report(
            report_data,
            str(pdf_path)
        )

        # --------------------------------------------------
        # UPDATE ANALYSIS RUN
        # --------------------------------------------------

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            UPDATE analysis_runs
            SET
                completed_at = CURRENT_TIMESTAMP,
                status = 'completed',
                resources_analyzed = %s,
                recommendations_generated = %s,
                estimated_savings = %s,
                report_path = %s
            WHERE id = %s
            """,
            (
                len(resources),
                len(recommendations),
                total_savings,
                str(pdf_path),
                run_id
            )
        )

        conn.commit()

        cursor.close()
        conn.close()

        print("\nREPORT GENERATED")
        print("-" * 60)
        print("HTML:", html_path)
        print("PDF :", pdf_path)
        print("Monthly cost:", round(
            total_monthly_cost,
            2
        ))
        print("Potential savings:", round(
            total_savings,
            2
        ))

        return {
            "run_id": run_id,
            "html_path": str(html_path),
            "pdf_path": str(pdf_path),
            "resources": len(resources),
            "recommendations": len(
                recommendations
            ),
            "monthly_cost": total_monthly_cost,
            "estimated_savings": total_savings
        }

    except Exception as error:

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            UPDATE analysis_runs
            SET
                completed_at = CURRENT_TIMESTAMP,
                status = 'failed',
                error_message = %s
            WHERE id = %s
            """,
            (
                str(error),
                run_id
            )
        )

        conn.commit()

        cursor.close()
        conn.close()

        raise


if __name__ == "__main__":

    result = generate_report()

    print("\n")
    print("=" * 60)
    print("REPORT GENERATION COMPLETED")
    print("=" * 60)

    print(result)
