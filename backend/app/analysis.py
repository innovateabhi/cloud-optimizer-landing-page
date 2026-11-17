from datetime import datetime

from app.agents.resource_agent import discover_resources
from app.agents.monitoring_agent import monitor_resources
from app.agents.cost_agent import calculate_ec2_costs
from app.agents.optimization_agent import generate_optimization_recommendations
from app.agents.risk_agent import calculate_risk
from app.agents.recommendation_agent import generate_recommendations

from app.database.connection import get_db_connection, is_mysql


def create_analysis_run():

    conn = get_db_connection()
    cursor = conn.cursor()

    if is_mysql():
        cursor.execute(
            """
            INSERT INTO analysis_runs
            (status, resources_analyzed, recommendations_generated, estimated_savings)
            VALUES (%s, %s, %s, %s)
            """,
            ("running", 0, 0, 0)
        )
        run_id = cursor.lastrowid
    else:
        cursor.execute(
            """
            INSERT INTO analysis_runs
            (status, resources_analyzed, recommendations_generated, estimated_savings)
            VALUES (%s, %s, %s, %s)
            RETURNING id
            """,
            ("running", 0, 0, 0)
        )
        run_id = cursor.fetchone()[0]

    conn.commit()

    cursor.close()
    conn.close()

    return run_id


def update_analysis_run(
    run_id,
    status,
    resources_analyzed=0,
    recommendations_generated=0,
    estimated_savings=0,
    report_path=None,
    error_message=None
):

    conn = get_db_connection()
    cursor = conn.cursor()

    if status in ("completed", "failed"):

        cursor.execute(
            """
            UPDATE analysis_runs
            SET
                completed_at = %s,
                status = %s,
                resources_analyzed = %s,
                recommendations_generated = %s,
                estimated_savings = %s,
                report_path = %s,
                error_message = %s
            WHERE id = %s
            """,
            (
                datetime.now(),
                status,
                resources_analyzed,
                recommendations_generated,
                estimated_savings,
                report_path,
                error_message,
                run_id
            )
        )

    else:

        cursor.execute(
            """
            UPDATE analysis_runs
            SET
                status = %s,
                resources_analyzed = %s,
                recommendations_generated = %s,
                estimated_savings = %s
            WHERE id = %s
            """,
            (
                status,
                resources_analyzed,
                recommendations_generated,
                estimated_savings,
                run_id
            )
        )

    conn.commit()

    cursor.close()
    conn.close()


def run_analysis():

    run_id = create_analysis_run()

    print("\n")
    print("=" * 70)
    print("        CLOUD COST OPTIMIZATION ANALYSIS")
    print("        RUN ID:", run_id)
    print("=" * 70)

    try:

        # ==================================================
        # STEP 1 — RESOURCE DISCOVERY
        # ==================================================

        print("\n[1/6] RESOURCE DISCOVERY")
        print("-" * 70)

        resources = discover_resources()

        print(
            f"Resources discovered: {len(resources)}"
        )

        # ==================================================
        # STEP 2 — MONITORING
        # ==================================================

        print("\n[2/6] MONITORING")
        print("-" * 70)

        monitor_resources()

        print("Monitoring completed.")

        # ==================================================
        # STEP 3 — COST ANALYSIS
        # ==================================================

        print("\n[3/6] COST ANALYSIS")
        print("-" * 70)

        costs = calculate_ec2_costs()

        print(
            f"Cost records processed: {len(costs)}"
        )

        # ==================================================
        # STEP 4 — OPTIMIZATION
        # ==================================================

        print("\n[4/6] OPTIMIZATION")
        print("-" * 70)

        optimization_results = (
            generate_optimization_recommendations()
        )

        print(
            f"Resources analyzed: "
            f"{len(optimization_results)}"
        )

        # ==================================================
        # STEP 5 — RISK ANALYSIS
        # ==================================================

        print("\n[5/6] RISK ANALYSIS")
        print("-" * 70)

        risk_results = calculate_risk()

        print(
            f"Recommendations risk-analyzed: "
            f"{len(risk_results)}"
        )

        # ==================================================
        # STEP 6 — FINAL RECOMMENDATIONS
        # ==================================================

        print("\n[6/6] RECOMMENDATIONS")
        print("-" * 70)

        recommendations = generate_recommendations()

        print(
            f"Recommendations generated: "
            f"{len(recommendations)}"
        )

        # ==================================================
        # CALCULATE TOTAL SAVINGS
        # ==================================================

        estimated_savings = sum(
            float(
                r.get("estimated_savings", 0) or 0
            )
            for r in recommendations
        )

        # ==================================================
        # UPDATE ANALYSIS RUN
        # ==================================================

        update_analysis_run(
            run_id=run_id,
            status="completed",
            resources_analyzed=len(resources),
            recommendations_generated=len(
                recommendations
            ),
            estimated_savings=estimated_savings
        )

        # ==================================================
        # SUMMARY
        # ==================================================

        print("\n")
        print("=" * 70)
        print("              ANALYSIS COMPLETED")
        print("=" * 70)

        print("Run ID:", run_id)
        print("Resources:", len(resources))
        print("Costs:", len(costs))
        print(
            "Optimizations:",
            len(optimization_results)
        )
        print(
            "Risk analyses:",
            len(risk_results)
        )
        print(
            "Recommendations:",
            len(recommendations)
        )
        print(
            "Estimated savings:",
            round(estimated_savings, 4),
            "USD/month"
        )

        return {
            "run_id": run_id,
            "resources": resources,
            "costs": costs,
            "optimizations": optimization_results,
            "risks": risk_results,
            "recommendations": recommendations,
            "estimated_savings": estimated_savings
        }

    except Exception as e:

        print("\nANALYSIS FAILED")
        print(str(e))

        update_analysis_run(
            run_id=run_id,
            status="failed",
            error_message=str(e)
        )

        raise


if __name__ == "__main__":

    run_analysis()
