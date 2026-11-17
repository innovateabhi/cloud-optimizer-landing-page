import hashlib
import pymysql
from datetime import datetime, timedelta

def hash_pw(pw: str) -> str:
    return hashlib.sha256(pw.encode('utf-8')).hexdigest()

def run_migration():
    conn = pymysql.connect(
        host='127.0.0.1',
        user='root',
        password='',
        db='cloud_optimization_db',
        charset='utf8mb4'
    )
    cur = conn.cursor()

    # 1. Tenants table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS tenants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        plan VARCHAR(50) NOT NULL DEFAULT 'starter',
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        setup_completed BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    """)

    # 2. Users table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tenant_id INT NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        two_factor_enabled BOOLEAN DEFAULT FALSE,
        two_factor_secret VARCHAR(255) NULL,
        otp_code VARCHAR(10) NULL,
        otp_expiry DATETIME NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_email (email),
        INDEX idx_user_tenant (tenant_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    """)

    # 3. Cloud Credentials table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS cloud_credentials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tenant_id INT NOT NULL,
        account_name VARCHAR(255) NOT NULL,
        provider VARCHAR(50) DEFAULT 'aws',
        auth_type VARCHAR(50) NOT NULL,
        role_arn VARCHAR(500) NULL,
        external_id VARCHAR(255) NULL,
        access_key_id VARCHAR(255) NULL,
        secret_access_key VARCHAR(500) NULL,
        region VARCHAR(50) DEFAULT 'ap-south-2',
        status VARCHAR(50) DEFAULT 'connected',
        discovered_resources INT DEFAULT 0,
        last_validated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_cred_tenant (tenant_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    """)

    # 4. Add tenant_id to existing resource and recommendation tables
    for tbl in ['resources', 'recommendations', 'actions', 'analysis_runs', 'metrics', 'costs']:
        cur.execute("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='cloud_optimization_db' AND TABLE_NAME=%s AND COLUMN_NAME='tenant_id'", (tbl,))
        if not cur.fetchone():
            cur.execute(f"ALTER TABLE {tbl} ADD COLUMN tenant_id INT DEFAULT 2")
            print(f"Added tenant_id column to {tbl}")

    # 5. Seed default tenants
    tenants_data = [
        (1, 'Acme Cloud Labs', 'free', 'active', True),
        (2, 'TechNova Solutions', 'starter', 'active', True),
        (3, 'GlobalScale Logistics', 'business', 'active', True),
        (4, 'Cloud Optimizer FinOps Technologies', 'enterprise', 'active', True),
    ]

    for tid, name, plan, status, setup_done in tenants_data:
        cur.execute("""
        INSERT INTO tenants (id, name, plan, status, setup_completed)
        VALUES (%s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE name=%s, plan=%s, status=%s, setup_completed=%s
        """, (tid, name, plan, status, setup_done, name, plan, status, setup_done))

    # 6. Seed default users
    users_data = [
        (1, 1, 'rahul@acmelabs.io', hash_pw('AcmeLabs@2026'), 'Rahul Sharma', 'user', False),
        (2, 2, 'priya@technova.com', hash_pw('TechNova@2026'), 'Priya Patel', 'user', False),
        (3, 3, 'vikram@globalscale.com', hash_pw('GlobalScale@2026'), 'Vikram Malhotra', 'user', False),
        (4, 4, 'admin@cloudoptimizer.io', hash_pw('Admin@CloudOptimizer2026'), 'Abhinandan (Owner)', 'admin', False),
    ]

    for uid, tid, email, pw, name, role, tfa in users_data:
        cur.execute("""
        INSERT INTO users (id, tenant_id, email, password_hash, full_name, role, two_factor_enabled)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE tenant_id=%s, email=%s, password_hash=%s, full_name=%s, role=%s
        """, (uid, tid, email, pw, name, role, tfa, tid, email, pw, name, role))

    # 7. Seed cloud credentials for tenants
    creds_data = [
        (1, 1, 'Acme-Production-AWS', 'aws', 'assume_role', 'arn:aws:iam::416384710566:role/AcmeLabsReadOnly', 'ext-acme-9921', None, None, 'ap-south-1', 'connected', 5),
        (2, 2, 'TechNova-AWS-Core', 'aws', 'assume_role', 'arn:aws:iam::416384710566:user/terra-admin', 'ext-technova-4412', 'AKIAIOSFODNN7EXAMPLE', '••••••••••••••••', 'ap-south-2', 'connected', 7),
        (3, 3, 'GlobalScale-MultiCloud-Prod', 'aws', 'assume_role', 'arn:aws:iam::416384710566:role/GlobalScaleFinOps', 'ext-global-7821', None, None, 'us-east-1', 'connected', 28),
    ]

    for cid, tid, acct, prov, atype, rarn, extid, akid, skey, reg, st, discs in creds_data:
        cur.execute("""
        INSERT INTO cloud_credentials (id, tenant_id, account_name, provider, auth_type, role_arn, external_id, access_key_id, secret_access_key, region, status, discovered_resources)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE account_name=%s, status=%s, discovered_resources=%s
        """, (cid, tid, acct, prov, atype, rarn, extid, akid, skey, reg, st, discs, acct, st, discs))

    # 8. Seed dedicated resources and recommendations for Free tenant (Tenant 1) and Business tenant (Tenant 3)
    # Existing resources in the DB belong to Tenant 2 (TechNova Solutions - Starter with real AWS instances).
    cur.execute("UPDATE resources SET tenant_id = 2 WHERE tenant_id IS NULL OR tenant_id = 0")
    cur.execute("UPDATE recommendations SET tenant_id = 2 WHERE tenant_id IS NULL OR tenant_id = 0")
    cur.execute("UPDATE actions SET tenant_id = 2 WHERE tenant_id IS NULL OR tenant_id = 0")
    cur.execute("UPDATE analysis_runs SET tenant_id = 2 WHERE tenant_id IS NULL OR tenant_id = 0")

    # Tenant 1: Free Tier resources (exactly 5 resources)
    free_resources = [
        ('i-0free-web01', 'EC2', 'acme-web-frontend', 'ap-south-1', 'running', 't3.micro', None, None, 1),
        ('i-0free-api01', 'EC2', 'acme-rest-backend', 'ap-south-1', 'running', 't3.small', None, None, 1),
        ('vol-0free-data01', 'EBS', 'acme-app-volume', 'ap-south-1', 'in-use', None, None, 50, 1),
        ('vol-0free-backup01', 'EBS', 'acme-unused-disk', 'ap-south-1', 'available', None, None, 100, 1),
        ('rds-acme-dev-mysql', 'RDS', 'acme-dev-database', 'ap-south-1', 'available', 'db.t3.micro', 'mysql', 20, 1),
    ]

    for rid, rtype, rname, reg, st, itype, eng, sz, tid in free_resources:
        cur.execute("""
        INSERT INTO resources (resource_id, resource_type, resource_name, region, state, instance_type, engine, size_gb, tenant_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE resource_name=%s, tenant_id=%s
        """, (rid, rtype, rname, reg, st, itype, eng, sz, tid, rname, tid))

    # Tenant 1 recommendation (Locked on free tier)
    cur.execute("""
    INSERT INTO recommendations (resource_id, recommendation_type, recommendation, estimated_savings, risk_level, confidence, status, tenant_id)
    SELECT 'vol-0free-backup01', 'DELETE_UNATTACHED_VOLUME', 'Unattached 100GB EBS volume incurring idle costs. Snapshot and delete to save storage costs.', 8.00, 'LOW', 95.00, 'pending', 1
    WHERE NOT EXISTS (SELECT 1 FROM recommendations WHERE resource_id='vol-0free-backup01' AND tenant_id=1)
    """)

    # Tenant 3: Business Tier resources (multi-region, 15+ resources, multiple recommendations, actions)
    biz_resources = [
        ('i-0biz-coreapp-01', 'EC2', 'globalscale-core-app-prod', 'us-east-1', 'running', 'c5.2xlarge', None, None, 3),
        ('i-0biz-coreapp-02', 'EC2', 'globalscale-core-app-replica', 'us-east-1', 'running', 'c5.2xlarge', None, None, 3),
        ('i-0biz-worker-01', 'EC2', 'globalscale-bg-worker', 'us-east-1', 'running', 'r5.xlarge', None, None, 3),
        ('i-0biz-worker-02', 'EC2', 'globalscale-kafka-broker', 'us-east-1', 'running', 'm5.xlarge', None, None, 3),
        ('i-0biz-eu-gw-01', 'EC2', 'globalscale-eu-gateway', 'eu-west-1', 'running', 't3.large', None, None, 3),
        ('i-0biz-legacy-srv', 'EC2', 'globalscale-old-reports', 'us-east-1', 'stopped', 'm4.large', None, None, 3),
        ('rds-global-prod-aurora', 'RDS', 'globalscale-aurora-cluster', 'us-east-1', 'available', 'db.r5.xlarge', 'aurora-postgresql', 250, 3),
        ('rds-global-analytics', 'RDS', 'globalscale-analytics-dw', 'us-east-1', 'available', 'db.m5.xlarge', 'postgres', 500, 3),
        ('vol-0biz-orphan-disk', 'EBS', 'globalscale-unused-snapshot-vol', 'us-east-1', 'available', None, None, 200, 3),
        ('vol-0biz-log-archive', 'EBS', 'globalscale-cold-logs', 'us-east-1', 'in-use', None, None, 500, 3),
        ('s3-globalscale-backups', 'S3', 'globalscale-cold-backups-2025', 'us-east-1', 'active', None, None, 2400, 3),
        ('s3-globalscale-assets', 'S3', 'globalscale-public-cdn-origin', 'us-east-1', 'active', None, None, 850, 3),
    ]

    for rid, rtype, rname, reg, st, itype, eng, sz, tid in biz_resources:
        cur.execute("""
        INSERT INTO resources (resource_id, resource_type, resource_name, region, state, instance_type, engine, size_gb, tenant_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE resource_name=%s, tenant_id=%s
        """, (rid, rtype, rname, reg, st, itype, eng, sz, tid, rname, tid))

    # Tenant 3 recommendations
    biz_recommendations = [
        ('i-0biz-coreapp-01', 'RIGHTSIZE_EC2', 'Downsize c5.2xlarge to c5.xlarge based on 14-day P99 CPU utilization under 16%.', 124.80, 'LOW', 94.00, 'pending', 3),
        ('vol-0biz-orphan-disk', 'DELETE_UNATTACHED_VOLUME', 'Unattached 200GB gp2 volume idle for 42 days. Safe snapshot and terminate.', 20.00, 'LOW', 99.00, 'pending', 3),
        ('rds-global-analytics', 'RESERVED_INSTANCE_COVERAGE', 'Convert on-demand RDS PostgreSQL instance to 1-Year No-Upfront Savings Plan.', 340.50, 'LOW', 92.00, 'pending', 3),
        ('s3-globalscale-backups', 'LIFECYCLE_POLICY_TRANSITION', 'Transition 2.4TB inactive objects in S3 Standard to Glacier Flexible Retrieval.', 48.00, 'LOW', 96.00, 'pending', 3),
    ]

    for rid, rtype, rec, sav, rrisk, conf, st, tid in biz_recommendations:
        cur.execute("""
        INSERT INTO recommendations (resource_id, recommendation_type, recommendation, estimated_savings, risk_level, confidence, status, tenant_id)
        SELECT %s, %s, %s, %s, %s, %s, %s, %s
        WHERE NOT EXISTS (SELECT 1 FROM recommendations WHERE resource_id=%s AND recommendation_type=%s AND tenant_id=%s)
        """, (rid, rtype, rec, sav, rrisk, conf, st, tid, rid, rtype, tid))

    # Tenant 3 executed actions audit log
    biz_actions = [
        ('i-0biz-old-build-01', 'STOP_IDLE_INSTANCE', 'executed', 'Instance CPU < 1% for 14 days, developer approved stop action.', 'LOW', datetime.now() - timedelta(days=2), 3),
        ('vol-0biz-temp-data', 'DELETE_UNATTACHED_VOLUME', 'executed', 'Orphaned volume deleted after verified automated snapshot.', 'LOW', datetime.now() - timedelta(days=1), 3),
        ('i-0biz-stage-redis', 'RIGHTSIZE_EC2', 'executed', 'Downsized r5.large to t3.medium saving $45/mo.', 'LOW', datetime.now() - timedelta(hours=6), 3),
    ]

    for rid, atype, ast, rsn, rrisk, dt, tid in biz_actions:
        cur.execute("""
        INSERT INTO actions (resource_id, action_type, action_status, reason, risk_level, executed_at, tenant_id)
        SELECT %s, %s, %s, %s, %s, %s, %s
        WHERE NOT EXISTS (SELECT 1 FROM actions WHERE resource_id=%s AND action_type=%s AND tenant_id=%s)
        """, (rid, atype, ast, rsn, rrisk, dt, tid, rid, atype, tid))

    conn.commit()
    conn.close()
    print("Auth, Tenants, Credentials and Tenant-Specific Data migrated successfully!")

if __name__ == '__main__':
    run_migration()
