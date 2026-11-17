import pymysql

def migrate_budget_columns():
    conn = pymysql.connect(
        host='127.0.0.1',
        user='root',
        password='',
        database='cloud_optimization_db',
        charset='utf8mb4'
    )
    cur = conn.cursor()

    columns = [
        ('monthly_budget', 'DECIMAL(12,2) DEFAULT 500.00'),
        ('budget_currency', "VARCHAR(10) DEFAULT 'USD'"),
        ('budget_alert_threshold', 'INT DEFAULT 85'),
        ('budget_alert_email', 'VARCHAR(255) NULL'),
        ('budget_last_alert_sent', 'DATETIME NULL')
    ]

    for col_name, col_def in columns:
        cur.execute("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='cloud_optimization_db' AND TABLE_NAME='tenants' AND COLUMN_NAME=%s", (col_name,))
        if not cur.fetchone():
            cur.execute(f"ALTER TABLE tenants ADD COLUMN {col_name} {col_def}")
            print(f"Added {col_name} to tenants table")

    # Set default values for existing tenants
    cur.execute("""
        UPDATE tenants
        SET monthly_budget = 500.00,
            budget_currency = 'USD',
            budget_alert_threshold = 85,
            budget_alert_email = 'billing@company.com'
        WHERE monthly_budget IS NULL OR monthly_budget = 0
    """)

    conn.commit()
    conn.close()
    print("Budget migration completed successfully.")

if __name__ == '__main__':
    migrate_budget_columns()
