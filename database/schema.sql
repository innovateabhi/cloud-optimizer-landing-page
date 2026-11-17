-- Cloud Optimizer SaaS Database Schema
-- Target: MySQL 8.x / MariaDB 10.5+
-- Storage Engine: InnoDB
-- Character Set: utf8mb4 / utf8mb4_unicode_ci

CREATE DATABASE IF NOT EXISTS cloud_optimizer 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE cloud_optimizer;

-- 1. Users
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    job_title VARCHAR(100) NULL,
    phone_number VARCHAR(30) NULL,
    avatar_url VARCHAR(500) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_platform_admin BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB;

-- 2. Organizations (Tenants)
CREATE TABLE IF NOT EXISTS organizations (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    industry VARCHAR(100) NULL,
    company_size VARCHAR(50) NULL,
    contact_email VARCHAR(255) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_org_slug (slug)
) ENGINE=InnoDB;

-- 3. Roles and Permissions
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    is_system BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS organization_members (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'analyst',
    is_owner BOOLEAN NOT NULL DEFAULT FALSE,
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_org_user (organization_id, user_id),
    CONSTRAINT fk_om_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    CONSTRAINT fk_om_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Subscription Plans & Entitlements
CREATE TABLE IF NOT EXISTS plans (
    id VARCHAR(50) PRIMARY KEY, -- 'free', 'starter', 'business', 'enterprise', 'msp'
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    price_inr DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    price_usd DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    billing_period VARCHAR(20) NOT NULL DEFAULT 'monthly', -- monthly, annual
    max_cloud_accounts INT NOT NULL DEFAULT 1,
    max_regions INT NOT NULL DEFAULT 2,
    max_resources INT NOT NULL DEFAULT 5,
    features_json JSON NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS subscriptions (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL,
    plan_id VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, past_due, canceled, trialing
    billing_cycle VARCHAR(20) NOT NULL DEFAULT 'monthly',
    current_period_start TIMESTAMP NOT NULL,
    current_period_end TIMESTAMP NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    gateway_customer_id VARCHAR(100) NULL,
    gateway_subscription_id VARCHAR(100) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_sub_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    CONSTRAINT fk_sub_plan FOREIGN KEY (plan_id) REFERENCES plans(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL,
    subscription_id VARCHAR(36) NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, succeeded, failed, refunded
    gateway_provider VARCHAR(50) NOT NULL DEFAULT 'razorpay',
    gateway_payment_id VARCHAR(100) NULL,
    gateway_order_id VARCHAR(100) NULL,
    receipt_url VARCHAR(500) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pay_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Cloud Accounts & Integrations
CREATE TABLE IF NOT EXISTS cloud_accounts (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL,
    provider VARCHAR(50) NOT NULL DEFAULT 'aws',
    account_name VARCHAR(150) NOT NULL,
    account_id VARCHAR(100) NOT NULL, -- e.g. 12-digit AWS Account ID
    iam_role_arn VARCHAR(500) NOT NULL,
    external_id VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, connected, verification_failed, disconnected
    last_synced_at TIMESTAMP NULL,
    error_message TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_ca_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    INDEX idx_ca_org_acc (organization_id, account_id)
) ENGINE=InnoDB;

-- 6. Cloud Resources
CREATE TABLE IF NOT EXISTS cloud_resources (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL,
    cloud_account_id VARCHAR(36) NOT NULL,
    service_name VARCHAR(50) NOT NULL, -- ec2, rds, ebs, s3, etc.
    resource_id VARCHAR(255) NOT NULL, -- i-0123456789abcdef0, vol-xxx, etc.
    resource_name VARCHAR(255) NULL,
    region VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL, -- running, stopped, available, in-use
    resource_type VARCHAR(100) NULL, -- t3.large, gp3, etc.
    tags_json JSON NULL,
    estimated_monthly_cost DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    utilization_score DECIMAL(5, 2) NULL, -- 0 to 100%
    is_idle BOOLEAN NOT NULL DEFAULT FALSE,
    is_overprovisioned BOOLEAN NOT NULL DEFAULT FALSE,
    last_discovered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cr_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    CONSTRAINT fk_cr_acc FOREIGN KEY (cloud_account_id) REFERENCES cloud_accounts(id) ON DELETE CASCADE,
    INDEX idx_cr_org_svc (organization_id, service_name),
    INDEX idx_cr_res_id (resource_id)
) ENGINE=InnoDB;

-- 7. Recommendations & Optimization Actions
CREATE TABLE IF NOT EXISTS recommendations (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL,
    resource_id VARCHAR(36) NOT NULL,
    agent_name VARCHAR(50) NOT NULL, -- RightSizingAgent, IdleResourceAgent, ReservationAgent
    action_type VARCHAR(50) NOT NULL, -- terminate, resize, migrate_storage, purchase_sp
    title VARCHAR(255) NOT NULL,
    finding TEXT NOT NULL,
    recommended_action TEXT NOT NULL,
    estimated_monthly_savings DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    risk_level VARCHAR(20) NOT NULL DEFAULT 'low', -- low, medium, high
    confidence_score DECIMAL(4, 2) NOT NULL DEFAULT 0.95,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, approved, rejected, executing, completed
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_rec_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    CONSTRAINT fk_rec_res FOREIGN KEY (resource_id) REFERENCES cloud_resources(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Human Approvals & Audit Trail
CREATE TABLE IF NOT EXISTS approval_requests (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL,
    recommendation_id VARCHAR(36) NOT NULL,
    requested_by VARCHAR(36) NULL,
    approved_by VARCHAR(36) NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, approved, rejected
    rejection_reason TEXT NULL,
    approved_at TIMESTAMP NULL,
    executed_at TIMESTAMP NULL,
    realized_monthly_savings DECIMAL(12, 2) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_app_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    CONSTRAINT fk_app_rec FOREIGN KEY (recommendation_id) REFERENCES recommendations(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. Sales Leads & Demo Requests
CREATE TABLE IF NOT EXISTS demo_requests (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    work_email VARCHAR(255) NOT NULL,
    company_name VARCHAR(200) NOT NULL,
    job_role VARCHAR(100) NOT NULL,
    monthly_cloud_spend VARCHAR(100) NOT NULL,
    aws_account_count INT NOT NULL DEFAULT 1,
    company_size VARCHAR(50) NOT NULL,
    message TEXT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'new', -- new, contacted, qualified, demo_scheduled, proposal_sent, won, lost
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_demo_email (work_email),
    INDEX idx_demo_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contact_inquiries (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'unread',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
