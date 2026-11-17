from app.aws.s3 import get_s3_buckets

buckets = get_s3_buckets()

print("\nS3 BUCKETS")
print("=" * 50)

for bucket in buckets:
    print(bucket)
