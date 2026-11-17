from datetime import date, timedelta

from app.aws.client import get_cost_explorer_client


def get_resource_costs(start_date=None, end_date=None):

    if end_date is None:
        end_date = date.today()

    if start_date is None:
        start_date = end_date - timedelta(days=30)

    ce = get_cost_explorer_client()

    response = ce.get_cost_and_usage(
        TimePeriod={
            "Start": start_date.isoformat(),
            "End": end_date.isoformat()
        },
        Granularity="MONTHLY",
        Metrics=["UnblendedCost"],
        GroupBy=[
            {
                "Type": "DIMENSION",
                "Key": "SERVICE"
            },
            {
                "Type": "DIMENSION",
                "Key": "RESOURCE_ID"
            }
        ]
    )

    costs = []

    for result in response.get("ResultsByTime", []):

        for group in result.get("Groups", []):

            keys = group.get("Keys", [])
            amount = float(
                group["Metrics"]["UnblendedCost"]["Amount"]
            )

            if len(keys) < 2:
                continue

            service = keys[0]
            resource_id = keys[1]

            costs.append({
                "service": service,
                "resource_id": resource_id,
                "cost": amount,
                "currency": "USD",
                "start_date": start_date,
                "end_date": end_date
            })

    return costs
