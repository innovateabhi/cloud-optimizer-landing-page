from app.aws.ec2 import get_ec2_instances
from app.aws.cloudwatch import get_ec2_cpu
from app.aws.pricing import get_ec2_hourly_price
from app.database.connection import get_db_connection


def generate_optimization_recommendations():

    instances = get_ec2_instances()

    conn = get_db_connection()
    cursor = conn.cursor()

    # ==================================================
    # MARK OLD PENDING RECOMMENDATIONS AS SUPERSEDED
    # ==================================================

    cursor.execute("""
        UPDATE recommendations
        SET status = 'superseded'
        WHERE status = 'pending'
    """)

    recommendations = []

    # ==================================================
    # ANALYZE RUNNING EC2 INSTANCES
    # ==================================================

    for instance in instances:

        # We only optimize running resources
        if instance["state"] != "running":
            continue

        instance_id = instance["instance_id"]
        instance_type = instance["instance_type"]
        region = instance["region"]

        print("\nRESOURCE")
        print("-" * 60)
        print("Instance:", instance_id)
        print("Type:", instance_type)
        print("Region:", region)

        # ==================================================
        # CPU UTILIZATION
        # ==================================================

        cpu = get_ec2_cpu(
            instance_id=instance_id,
            region=region
        )

        if cpu is None:
            print("CPU data unavailable. Skipping resource.")
            continue

        print("CPU:", round(cpu, 2), "%")

        # ==================================================
        # CURRENT EC2 PRICE
        # ==================================================

        hourly_price = get_ec2_hourly_price(instance_type)

        daily_cost = hourly_price * 24
        monthly_cost = hourly_price * 24 * 30

        print(
            "Hourly cost:",
            round(hourly_price, 6),
            "USD"
        )

        print(
            "Estimated monthly cost:",
            round(monthly_cost, 4),
            "USD"
        )

        # ==================================================
        # DEFAULT VALUES
        # ==================================================

        recommendation_type = "NO_ACTION"

        recommendation = (
            "Resource utilization is within a healthy range."
        )

        estimated_savings = 0

        risk_level = "LOW"

        confidence = 90

        # ==================================================
        # OPTIMIZATION RULES
        # ==================================================

        if cpu < 5:

            recommendation_type = "STOP_INSTANCE"

            recommendation = (
                f"Instance {instance_id} has very low CPU "
                f"utilization ({cpu:.2f}%). Consider stopping "
                f"the instance if it is not required for "
                f"production workloads."
            )

            estimated_savings = monthly_cost

            risk_level = "MEDIUM"

            confidence = 85

        elif cpu < 20:

            recommendation_type = "DOWNSIZE_INSTANCE"

            recommendation = (
                f"Instance {instance_id} has low CPU utilization "
                f"({cpu:.2f}%). Consider downsizing the instance "
                f"type to reduce monthly costs."
            )

            # Conservative estimated savings
            estimated_savings = monthly_cost * 0.30

            risk_level = "LOW"

            confidence = 80

        elif cpu <= 70:

            recommendation_type = "NO_ACTION"

            recommendation = (
                f"Instance {instance_id} has healthy CPU "
                f"utilization ({cpu:.2f}%). No optimization "
                f"action is currently required."
            )

            estimated_savings = 0

            risk_level = "LOW"

            confidence = 95

        elif cpu <= 90:

            recommendation_type = "MONITOR"

            recommendation = (
                f"Instance {instance_id} has relatively high "
                f"CPU utilization ({cpu:.2f}%). Monitor workload "
                f"behavior before making optimization changes."
            )

            estimated_savings = 0

            risk_level = "LOW"

            confidence = 85

        else:

            recommendation_type = "INVESTIGATE_OVERUTILIZATION"

            recommendation = (
                f"Instance {instance_id} has very high CPU "
                f"utilization ({cpu:.2f}%). Investigate workload "
                f"requirements and consider scaling if necessary."
            )

            estimated_savings = 0

            risk_level = "MEDIUM"

            confidence = 90

        # ==================================================
        # SAVE RECOMMENDATION TO DATABASE
        # ==================================================

        cursor.execute(
            """
            INSERT INTO recommendations
            (
                resource_id,
                recommendation_type,
                recommendation,
                estimated_savings,
                risk_level,
                confidence,
                status
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                instance_id,
                recommendation_type,
                recommendation,
                estimated_savings,
                risk_level,
                confidence,
                "pending"
            )
        )

        # ==================================================
        # ADD RESULT
        # ==================================================

        recommendations.append({
            "resource_id": instance_id,
            "cpu": cpu,
            "hourly_cost": hourly_price,
            "daily_cost": daily_cost,
            "monthly_cost": monthly_cost,
            "recommendation_type": recommendation_type,
            "recommendation": recommendation,
            "estimated_savings": estimated_savings,
            "risk_level": risk_level,
            "confidence": confidence
        })

        # ==================================================
        # DISPLAY RESULT
        # ==================================================

        print(
            "Recommendation:",
            recommendation_type
        )

        print(
            "Estimated savings:",
            round(estimated_savings, 4),
            "USD/month"
        )

        print(
            "Risk:",
            risk_level
        )

        print(
            "Confidence:",
            confidence,
            "%"
        )

    # ==================================================
    # COMMIT DATABASE CHANGES
    # ==================================================

    conn.commit()

    cursor.close()
    conn.close()

    return recommendations


# ======================================================
# DIRECT EXECUTION
# ======================================================

if __name__ == "__main__":

    print("\nOPTIMIZATION AGENT")
    print("=" * 60)

    results = generate_optimization_recommendations()

    print("\n" + "=" * 60)
    print("Optimization completed.")
    print("Resources analyzed:", len(results))
