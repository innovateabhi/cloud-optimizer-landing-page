from app.aws.ec2 import get_ec2_instances


instances = get_ec2_instances()

print("\nEC2 INSTANCES")
print("=" * 50)

for instance in instances:
    print(instance)
