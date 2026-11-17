from datetime import datetime

from app.aws.cloudwatch import get_ec2_cpu, get_rds_cpu
from app.database.connection import get_db_connection


def save_metric(
    resource_id,
    metric_name,
    metric_value,
    unit
):
    """
    Store a metric in PostgreSQL.
    """

    if metric_value is None:
        return

    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
        INSERT INTO metrics (
            resource_id,
            metric_name,
            metric_value,
            unit,
            timestamp
        )
        VALUES (%s, %s, %s, %s, %s)
    """

    cursor.execute(
        query,
        (
            resource_id,
            metric_name,
            metric_value,
            unit,
            datetime.now()
        )
    )

    conn.commit()

    cursor.close()
    conn.close()


def monitor_ec2():

    print("\nMonitoring EC2 instances...")

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            resource_id,
            region,
            state
        FROM resources
        WHERE resource_type = 'EC2'
    """)

    resources = cursor.fetchall()

    cursor.close()
    conn.close()

    for resource_id, region, state in resources:

        if state != "running":
            print(
                f"Skipping EC2 {resource_id} "
                f"(state: {state})"
            )
            continue

        cpu = get_ec2_cpu(
            instance_id=resource_id,
            region=region
        )

        if cpu is None:
            print(
                f"No CPU data available for {resource_id}"
            )
            continue

        print(
            f"EC2 {resource_id} "
            f"CPU: {cpu:.2f}%"
        )

        save_metric(
            resource_id=resource_id,
            metric_name="CPUUtilization",
            metric_value=cpu,
            unit="Percent"
        )


def monitor_rds():

    print("\nMonitoring RDS instances...")

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            resource_id,
            region,
            state
        FROM resources
        WHERE resource_type = 'RDS'
    """)

    resources = cursor.fetchall()

    cursor.close()
    conn.close()

    for resource_id, region, state in resources:

        if state != "available":
            print(
                f"Skipping RDS {resource_id} "
                f"(state: {state})"
            )
            continue

        cpu = get_rds_cpu(
            db_identifier=resource_id,
            region=region
        )

        if cpu is None:
            print(
                f"No CPU data available for {resource_id}"
            )
            continue

        print(
            f"RDS {resource_id} "
            f"CPU: {cpu:.2f}%"
        )

        save_metric(
            resource_id=resource_id,
            metric_name="CPUUtilization",
            metric_value=cpu,
            unit="Percent"
        )


def monitor_resources():

    print("\n" + "=" * 60)
    print("MONITORING AGENT")
    print("=" * 60)

    monitor_ec2()
    monitor_rds()

    print("\n" + "=" * 60)
    print("MONITORING COMPLETED")
    print("=" * 60)


if __name__ == "__main__":
    monitor_resources()
