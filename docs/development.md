# Cloud Optimizer — Local Development Guide

## Prerequisites
- Node.js LTS (v20+ or v24+)
- Python 3.12+
- XAMPP / MySQL 8.x
- Git

## Frontend Setup (Phase 1)
```powershell
cd frontend
npm install
npm run dev
```
Development URL: `http://localhost:5173`

## Backend Setup (Phase 2+)
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API Documentation: `http://127.0.0.1:8000/docs`

## Database Setup
Import the database schema:
```powershell
mysql -u root -p < database/schema.sql
mysql -u root -p cloud_optimizer < database/seed.sql
```
