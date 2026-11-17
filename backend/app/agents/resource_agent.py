from datetime import datetime

from app.aws.ec2 import get_ec2_instances
from app.aws.rds import get_rds_instances
from app.aws.s3 import get_s3_buckets

from app.database.connection import get_db_connection, is_mysql


def save_resource(
    resource_id,
    resource_type,
    resource_name=None,
    region=None,
    state=None,
    instance_type=None,
    engine=None,
    size_gb=None
):
    conn = get_db_connection()
    cursor = conn.cursor()

    if is_mysql():
        query = """
            INSERT INTO resources (
                resource_id,
                resource_type,
                resource_name,
                region,
                state,
                instance_type,
                engine,
                size_gb,
                discovered_at,
                last_seen_at
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                resource_type = VALUES(resource_type),
                resource_name = VALUES(resource_name),
                region = VALUES(region),
                state = VALUES(state),
                instance_type = VALUES(instance_type),
                engine = VALUES(engine),
                size_gb = VALUES(size_gb),
                last_seen_at = VALUES(last_seen_at)
        """
    else:
        query = """
            INSERT INTO resources (
                resource_id,
                resource_type,
                resource_name,
                region,
                state,
                instance_type,
                engine,
                size_gb,
                discovered_at,
                last_seen_at
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (resource_id)
            DO UPDATE SET
                resource_type = EXCLUDED.resource_type,
                resource_name = EXCLUDED.resource_name,
                region = EXCLUDED.region,
                state = EXCLUDED.state,
                instance_type = EXCLUDED.instance_type,
                engine = EXCLUDED.engine,
                size_gb = EXCLUDED.size_gb,
                last_seen_at = EXCLUDED.last_seen_at
        """

    now = datetime.now()

    cursor.execute(
        query,
        (
            resource_id,
            resource_type,
            resource_name,
            region,
            state,
            instance_type,
            engine,
            size_gb,
            now,
            now
        )
    )

    conn.commit()

    cursor.close()
    conn.close()


def discover_ec2():
    print("\nDiscovering EC2 instances...")

    instances = get_ec2_instances()

    for instance in instances:

        save_resource(
            resource_id=instance["instance_id"],
            resource_type="EC2",
            resource_name=instance["instance_name"],
            region=instance["region"],
            state=instance["state"],
            instance_type=instance["instance_type"]
        )

    print(f"EC2 resources discovered: {len(instances)}")

    return instances


def discover_rds():
    print("\nDiscovering RDS instances...")

    databases = get_rds_instances()

    for db in databases:

        save_resource(
            resource_id=db["db_identifier"],
            resource_type="RDS",
            resource_name=db["db_identifier"],
            region=db["region"],
            state=db["status"],
            engine=db["engine"]
        )

    print(f"RDS resources discovered: {len(databases)}")

    return databases


def discover_s3():
    print("\nDiscovering S3 buckets...")

    buckets = get_s3_buckets()

    for bucket in buckets:

        save_resource(
            resource_id=bucket["bucket_name"],
            resource_type="S3",
            resource_name=bucket["bucket_name"],
            region="ap-south-2",
            state="active"
        )

    print(f"S3 resources discovered: {len(buckets)}")

    return buckets


def discover_resources():

    print("\n" + "=" * 60)
    print("RESOURCE DISCOVERY AGENT")
    print("=" * 60)

    ec2_resources = discover_ec2()

    rds_resources = discover_rds()

    s3_resources = discover_s3()

    print("\n" + "=" * 60)
    print("RESOURCE DISCOVERY COMPLETED")
    print("=" * 60)

    return {
        "ec2": ec2_resources,
        "rds": rds_resources,
        "s3": s3_resources
    }


if __name__ == "__main__":
    discover_resources()
