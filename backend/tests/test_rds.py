from app.aws.rds import get_rds_instances

databases = get_rds_instances()

print("\nRDS INSTANCES")
print("=" * 50)

for db in databases:
    print(db)
