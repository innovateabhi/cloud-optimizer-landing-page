# Cloud Optimizer — Premium AI-Powered Cloud Cost Intelligence SaaS Platform

Cloud Optimizer is a modern, enterprise-grade B2B SaaS platform that helps organizations monitor cloud infrastructure, analyze AWS spending, identify unused or underutilized resources, generate AI-powered cost optimization recommendations, evaluate risks, and track realized savings.

## 🚀 Key Features

- **Automated AWS Resource Discovery**: Read-only, least-privilege discovery of EC2, EBS, RDS, S3, CloudWatch, and Cost Explorer.
- **Cost Intelligence & Anomaly Detection**: Deep granular breakdown across AWS services, regions, and accounts with trend analysis.
- **Multi-Agent AI Recommendation Engine**: Deterministic detection rules + specialized AI agents for right-sizing, idle resources, and reservations.
- **Human-Approved Optimization Lifecycle**: Proposed actions require explicit authorized human approval before execution; supports dry-run / simulation.
- **Interactive Cloud Savings Calculator**: Real-time modeling of potential savings across workloads and annual projections.
- **Multi-Tier Subscription & Entitlements**: Free, Starter, Business, Enterprise, and MSP Partner tier structures.
- **Light Theme Enterprise UI/UX**: Built with React, Vite, TypeScript, Tailwind CSS, Motion for React (Framer Motion), Lucide React, and Recharts.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 / Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS, CSS variables for design tokens
- **Icons**: Lucide React
- **Animation**: Motion for React (`framer-motion`)
- **Charts**: Recharts
- **Routing**: React Router v6
- **Forms & Validation**: React Hook Form + Zod

### Backend (Future Phases)
- **Runtime**: Python 3.12+
- **Framework**: FastAPI
- **ORM & DB**: SQLAlchemy 2.x, Alembic, MySQL 8.x (PyMySQL)
- **Auth**: Argon2 password hashing, secure JWT / HTTP-only cookies
- **Cloud SDK**: Boto3 (AWS STS cross-account assume-role)

---

## 📁 Repository Structure

```text
cloud-optimizer/
├── frontend/          # React + Vite + TypeScript marketing & SaaS frontend
│   ├── public/        # Static assets (favicons, badges, illustrations)
│   ├── src/
│   │   ├── components/# Reusable UI, marketing sections, charts, pricing, calculators
│   │   ├── pages/     # Landing, Features, Solutions, Pricing, Security, Demo, Auth
│   │   ├── styles/    # Tailwind & global CSS design tokens
│   │   ├── data/      # Demo datasets, pricing tiers, FAQs
│   │   ├── hooks/     # Custom React hooks
│   │   └── utils/     # Formatting, calculations, animation variants
│   └── package.json
├── backend/           # FastAPI backend application (Phase 2+)
├── database/          # Database schema (MySQL) and seed data
├── docs/              # Architecture, API specifications, and development guides
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start (Phase 1 — Frontend Marketing Website)

```powershell
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.
