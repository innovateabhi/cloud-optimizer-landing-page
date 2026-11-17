import boto3

from app.config import AWS_REGION


def get_ec2_client(region=None):
    return boto3.client(
        "ec2",
        region_name=region or AWS_REGION
    )


def get_rds_client(region=None):
    return boto3.client(
        "rds",
        region_name=region or AWS_REGION
    )


def get_s3_client(region=None):
    return boto3.client(
        "s3",
        region_name=region or AWS_REGION
    )


def get_cloudwatch_client(region=None):
    return boto3.client(
        "cloudwatch",
        region_name=region or AWS_REGION
    )


def get_cost_explorer_client():
    return boto3.client(
        "ce",
        region_name="us-east-1"
    )

def get_pricing_client():
    return boto3.client(
        "pricing",
        region_name="us-east-1"
    )
