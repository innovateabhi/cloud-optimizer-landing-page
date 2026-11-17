from datetime import date, timedelta

from app.aws.ec2 import get_ec2_instances
from app.aws.pricing import get_ec2_hourly_price
from app.database.connection import get_db_connection


def calculate_ec2_costs():
    instances = get_ec2_instances()

    conn = get_db_connection()
    cursor = conn.cursor()

    results = []

    start_date = date.today() - timedelta(days=30)
    end_date = date.today()

    for instance in instances:

        # Ignore stopped instances
        if instance["state"] != "running":
            continue

        instance_id = instance["instance_id"]
        instance_type = instance["instance_type"]
        region = instance["region"]

        hourly_price = get_ec2_hourly_price(instance_type)

        daily_cost = hourly_price * 24
        monthly_cost = daily_cost * 30

        print("\nRESOURCE")
        print("-" * 50)
        print("Instance:", instance_id)
        print("Type:", instance_type)
        print("State:", instance["state"])
        print("Region:", region)
        print("Hourly:", round(hourly_price, 6), "USD")
        print("Daily:", round(daily_cost, 4), "USD")
        print("Monthly:", round(monthly_cost, 4), "USD")

        cursor.execute(
            """
            INSERT INTO costs
            (
                resource_id,
                service,
                region,
                cost_amount,
                currency,
                start_date,
                end_date
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                instance_id,
                "EC2",
                region,
                monthly_cost,
                "USD",
                start_date,
                end_date
            )
        )

        results.append({
            "resource_id": instance_id,
            "service": "EC2",
            "region": region,
            "hourly_cost": hourly_price,
            "daily_cost": daily_cost,
            "monthly_cost": monthly_cost
        })

    conn.commit()

    cursor.close()
    conn.close()

    return results


if __name__ == "__main__":

    print("\nEC2 COST AGENT")
    print("=" * 60)

    costs = calculate_ec2_costs()

    print("\nCompleted.")
    print("Resources processed:", len(costs))
