import json

from app.aws.client import get_pricing_client


def get_ec2_hourly_price(instance_type, region="ap-south-2"):

    pricing = get_pricing_client()

    response = pricing.get_products(
        ServiceCode="AmazonEC2",
        Filters=[
            {
                "Type": "TERM_MATCH",
                "Field": "instanceType",
                "Value": instance_type
            },
            {
                "Type": "TERM_MATCH",
                "Field": "location",
                "Value": "Asia Pacific (Hyderabad)"
            },
            {
                "Type": "TERM_MATCH",
                "Field": "operatingSystem",
                "Value": "Linux"
            },
            {
                "Type": "TERM_MATCH",
                "Field": "tenancy",
                "Value": "Shared"
            },
            {
                "Type": "TERM_MATCH",
                "Field": "preInstalledSw",
                "Value": "NA"
            },
            {
                "Type": "TERM_MATCH",
                "Field": "capacitystatus",
                "Value": "Used"
            }
        ],
        MaxResults=10
    )

    for product in response.get("PriceList", []):

        product_data = json.loads(product)

        terms = product_data.get("terms", {})
        on_demand = terms.get("OnDemand", {})

        for term in on_demand.values():

            price_dimensions = term.get("priceDimensions", {})

            for dimension in price_dimensions.values():

                price = dimension["pricePerUnit"].get("USD")

                if price:
                    return float(price)

    return None
