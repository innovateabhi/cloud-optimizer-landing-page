from app.aws.client import get_ec2_client


def get_ec2_instances(region=None):

    ec2 = get_ec2_client(region)

    response = ec2.describe_instances()

    instances = []

    for reservation in response.get("Reservations", []):

        for instance in reservation.get("Instances", []):

            state = instance["State"]["Name"]

            if state == "terminated":
                continue

            # Get EC2 Name tag
            instance_name = instance["InstanceId"]

            for tag in instance.get("Tags", []):
                if tag.get("Key") == "Name":
                    instance_name = tag.get("Value")
                    break

            instances.append({
                "instance_id": instance["InstanceId"],
                "instance_name": instance_name,
                "instance_type": instance["InstanceType"],
                "state": state,
                "region": ec2.meta.region_name
            })

    return instances
