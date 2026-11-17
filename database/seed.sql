-- Seed Data for Cloud Optimizer SaaS
USE cloud_optimizer;

-- Insert Standard Subscription Plans
INSERT INTO plans (id, name, description, price_inr, price_usd, billing_period, max_cloud_accounts, max_regions, max_resources, features_json, is_active)
VALUES
('free', 'Free Plan', 'Essential cloud cost visibility for individuals and early exploration', 0.00, 0.00, 'monthly', 1, 2, 5, 
 '{"ai_recommendations": false, "anomaly_detection": false, "approval_workflows": false, "reporting": "basic", "support": "community"}', TRUE),

('starter', 'Starter Plan', 'Intelligent monitoring and automated AI recommendations for growing teams', 1999.00, 29.00, 'monthly', 3, 5, 50, 
 '{"ai_recommendations": true, "anomaly_detection": false, "approval_workflows": false, "reporting": "standard", "support": "email"}', TRUE),

('business', 'Business Plan', 'Comprehensive FinOps optimization, forecasting, and team approval controls', 5999.00, 79.00, 'monthly', 10, 30, 500, 
 '{"ai_recommendations": true, "anomaly_detection": true, "approval_workflows": true, "forecasting": true, "reporting": "advanced", "support": "priority"}', TRUE),

('enterprise', 'Enterprise Plan', 'Custom scale, dedicated governance, RBAC, SSO, and high-touch support', 0.00, 0.00, 'monthly', 999, 999, 100000, 
 '{"ai_recommendations": true, "anomaly_detection": true, "approval_workflows": true, "forecasting": true, "reporting": "custom", "sso": true, "audit_logs": true, "support": "dedicated"}', TRUE)
ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    price_inr = VALUES(price_inr),
    price_usd = VALUES(price_usd);

-- Insert System Roles
INSERT INTO roles (id, name, description, is_system)
VALUES
('role_owner', 'Organization Owner', 'Full control over billing, members, cloud connections, and approvals', TRUE),
('role_admin', 'Admin', 'Manage cloud accounts, teams, and trigger discovery runs', TRUE),
('role_approver', 'Approver', 'Authorized to review and approve or reject optimization actions', TRUE),
('role_analyst', 'Analyst', 'Analyze cost trends, view recommendations, and generate reports', TRUE),
('role_viewer', 'Viewer', 'Read-only access to dashboards and high-level metrics', TRUE)
ON DUPLICATE KEY UPDATE name = VALUES(name);
