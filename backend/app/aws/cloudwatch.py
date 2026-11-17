from datetime import datetime, timedelta, timezone

from app.aws.client import get_cloudwatch_client


def get_metric_average(
    namespace,
    metric_name,
    dimensions,
    region=None,
    minutes=30
):
    """
    Fetch the average value of a CloudWatch metric
    over the last `minutes` minutes.
    """

    cloudwatch = get_cloudwatch_client(region)

    end_time = datetime.now(timezone.utc)
    start_time = end_time - timedelta(minutes=minutes)

    response = cloudwatch.get_metric_statistics(
        Namespace=namespace,
        MetricName=metric_name,
        Dimensions=dimensions,
        StartTime=start_time,
        EndTime=end_time,
        Period=300,
        Statistics=["Average"],
        Unit="Percent" 
    )

    datapoints = response.get("Datapoints", [])

    if not datapoints:
        return None

    values = [
        datapoint["Average"]
        for datapoint in datapoints
        if "Average" in datapoint
    ]

    if not values:
        return None

    return sum(values) / len(values)


def get_ec2_cpu(instance_id, region=None):
    """
    Get average EC2 CPU utilization.
    """

    return get_metric_average(
        namespace="AWS/EC2",
        metric_name="CPUUtilization",
        dimensions=[
            {
                "Name": "InstanceId",
                "Value": instance_id
            }
        ],
        region=region
    )


def get_rds_cpu(db_identifier, region=None):
    """
    Get average RDS CPU utilization.
    """

    return get_metric_average(
        namespace="AWS/RDS",
        metric_name="CPUUtilization",
        dimensions=[
            {
                "Name": "DBInstanceIdentifier",
                "Value": db_identifier
            }
        ],
        region=region
    )
