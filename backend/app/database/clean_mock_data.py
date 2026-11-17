import pymysql

def clean_database():
    conn = pymysql.connect(
        host='127.0.0.1',
        user='root',
        password='',
        database='cloud_optimization_db',
        charset='utf8mb4'
    )
    cur = conn.cursor()

    # 1. Delete all mock resources
    mock_id_prefixes = [
        'i-0biz-%',
        'i-0free-%',
        'rds-acme-%',
        'rds-global-%',
        's3-globalscale-%',
        'vol-0biz-%',
        'vol-0free-%'
    ]

    for prefix in mock_id_prefixes:
        cur.execute("DELETE FROM resources WHERE resource_id LIKE %s", (prefix,))
        print(f"Deleted resources matching {prefix}: {cur.rowcount}")

        cur.execute("DELETE FROM recommendations WHERE resource_id LIKE %s", (prefix,))
        print(f"Deleted recommendations matching {prefix}: {cur.rowcount}")

        cur.execute("DELETE FROM actions WHERE resource_id LIKE %s", (prefix,))
        print(f"Deleted actions matching {prefix}: {cur.rowcount}")

        cur.execute("DELETE FROM metrics WHERE resource_id LIKE %s", (prefix,))
        cur.execute("DELETE FROM costs WHERE resource_id LIKE %s", (prefix,))

    conn.commit()

    # Query remaining resources
    cur.execute("SELECT resource_id, resource_name, resource_type, region, state FROM resources")
    remaining = cur.fetchall()
    print("\nONLY REAL RESOURCES REMAINING:")
    for r in remaining:
        print(r)

    # Query remaining recommendations
    cur.execute("SELECT id, resource_id, recommendation_type, estimated_savings FROM recommendations")
    recs = cur.fetchall()
    print("\nONLY REAL RECOMMENDATIONS REMAINING:")
    for rc in recs:
        print(rc)

    conn.close()

if __name__ == '__main__':
    clean_database()
