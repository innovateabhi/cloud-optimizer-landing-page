from app.aws.client import get_s3_client


def get_s3_buckets():

    s3 = get_s3_client()

    response = s3.list_buckets()

    buckets = []

    for bucket in response.get("Buckets", []):

        buckets.append({
            "bucket_name": bucket["Name"],
            "creation_date": bucket["CreationDate"]
        })

    return buckets
