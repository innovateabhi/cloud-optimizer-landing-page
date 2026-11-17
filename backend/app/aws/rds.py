from app.aws.client import get_rds_client


def get_rds_instances(region=None):

    rds = get_rds_client(region)

    response = rds.describe_db_instances()

    databases = []

    for db in response.get("DBInstances", []):

        databases.append({
            "db_identifier": db["DBInstanceIdentifier"],
            "engine": db["Engine"],
            "engine_version": db.get("EngineVersion"),
            "db_instance_class": db["DBInstanceClass"],
            "status": db["DBInstanceStatus"],
            "region": rds.meta.region_name
        })

    return databases
