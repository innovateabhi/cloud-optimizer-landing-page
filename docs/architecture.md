# Cloud Optimizer — Architecture Specification

## 1. Executive Summary
Cloud Optimizer is an enterprise B2B SaaS platform engineered for automated cloud visibility, cost anomaly detection, AI-driven infrastructure rightsizing, and verified savings tracking.

## 2. Core Architectural Principles
- **Least-Privilege Security**: Read-only AWS discovery through AWS STS `AssumeRole` with unique `ExternalId` parameters. No long-lived credentials, API keys, or root secrets are ever stored.
- **Human-in-the-Loop Governance**: Automated AI discovery and analysis generate proposals, but execution of infrastructure modifications strictly requires affirmative human authorization through a segregated execution role.
- **Strict Multi-Tenancy**: Tenant data isolation enforced at the database query layer via `organization_id`.
- **Database-Agnostic Design**: Standard SQL schema compatible with MySQL 8.x, MariaDB, and easily migratable to PostgreSQL.

## 3. High-Level Architecture Diagram

```
[ Frontend: React + Vite + Tailwind + Framer Motion ]
                     │ HTTPS / REST
                     ▼
[ Backend API: FastAPI (Python 3.12+) ]
    ├── Auth & Organization Middleware (JWT / Secure Cookie)
    ├── Subscription & Entitlement Engine (Razorpay)
    ├── Multi-Agent Cost & Discovery Orchestrator
    └── AWS Boto3 Connector (STS AssumeRole + CloudWatch + Cost Explorer)
                     │
       ┌─────────────┴──────────────┐
       ▼                            ▼
[ MySQL 8.x Database ]     [ AWS Cloud Infrastructure ]
  - Tenant Data              - Read-only Discovery
  - Recommendations          - Metrics Collection
  - Audit Logs               - Scoped Execution (Simulated in Phase 1)
```

## 4. Multi-Agent Engine
1. **Resource Discovery Agent**: Crawls EC2, EBS, RDS, S3, CloudWatch metrics.
2. **Monitoring & Metric Normalizer**: Aggregates CPU, memory, IOPS, and network utilization.
3. **Cost Analysis Agent**: Computes historical spending curves and detects anomalous spikes.
4. **Optimization Agent**: Identifies unattached EBS volumes, idle EC2 instances, and unreserved steady-state workloads.
5. **Risk Assessment Agent**: Evaluates workload criticality, tags (e.g. `env:prod`), and assign risk tiers (Low, Medium, High).
6. **Recommendation Agent**: Formats actionable proposals with evidence, confidence score, and projected monthly/annual savings.
7. **Execution Simulation Agent**: Verifies preconditions and simulates safety checks before execution approval.
8. **Reporting & Verification Agent**: Compares pre- and post-optimization billing records to prove realized ROI.
