# Production Deployment Runbook — Unified Hybrid Adaptive Learning Platform

## 1. Architecture Topology

```
                         Cloudflare CDN / DNS
                                  │
                                  ▼
                   Vercel / Cloudflare Pages (Next.js)
                                  │
                                  ▼
                     Railway / Render (FastAPI API)
                                  │
                  ┌───────────────┴───────────────┐
                  ▼                               ▼
       Managed PostgreSQL Cluster          AI Providers (Server-side)
        (Authoritative DB Ledger)             - Google Gemini API
                  │                           - Claude / OpenAI
                  ▼
         Cloudflare R2 / S3
          (Object Storage)
```

---

## 2. Infrastructure Setup & Provisioning

### A. Database Provisioning (Managed PostgreSQL)
1. Provision a PostgreSQL 15+ database on **Neon**, **Supabase**, **Railway**, or **AWS RDS**.
2. Retrieve the connection string:
   ```bash
   postgresql+psycopg2://<user>:<password>@<host>:5432/<database>?sslmode=require
   ```
3. Set environment variable `DATABASE_URL`.

### B. Backend API Deployment (Railway / Render / Docker)
1. **Dockerfile Configuration**:
   ```dockerfile
   FROM python:3.11-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   COPY . .
   EXPOSE 8000
   CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```
2. **Deploy on Railway / Render**:
   - Set build command: `pip install -r requirements.txt`
   - Set start command: `uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --workers 4`
   - Configure Environment Variables (from `.env.production.example`).

### C. Frontend Deployment (Vercel)
1. Import repository on **Vercel** (`pentacourse`).
2. Framework Preset: **Next.js**.
3. Configure Environment Variables:
   ```bash
   NEXT_PUBLIC_APP_URL="https://pentacourse.com"
   NEXT_PUBLIC_API_URL="https://api.pentacourse.com"
   ```
4. Build Command: `next build`.

---

## 3. Database Migration & Seeding Commands

```bash
# 1. Run Alembic Migrations against Production PostgreSQL
alembic upgrade head

# 2. Run Idempotent Seed Data (4 Multi-Domain Knowledge Graphs)
python -c "from backend.app.seeds.seed_data import seed_all; seed_all()"
```

---

## 4. Payment Gateway Webhook Webhook Configuration

### Stripe
1. In Stripe Dashboard $\to$ **Developers** $\to$ **Webhooks**:
   - Add endpoint: `https://api.pentacourse.com/api/v1/commerce/webhooks/stripe`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`
   - Copy Signing Secret (`whsec_...`) to `STRIPE_WEBHOOK_SECRET`.

### bKash
1. In bKash Merchant Portal:
   - Configure IPN / Callback URL: `https://api.pentacourse.com/api/v1/commerce/webhooks/bkash`
   - Set credentials in `BKASH_APP_KEY`, `BKASH_APP_SECRET`, `BKASH_USERNAME`, `BKASH_PASSWORD`.

---

## 5. Rollback Procedure
If a critical issue is discovered post-deployment:
1. **Frontend Rollback**: In Vercel dashboard, click instantaneous rollback to previous stable deployment.
2. **Backend Rollback**: In Railway/Render, trigger previous image deployment.
3. **Database Migration Downgrade**:
   ```bash
   alembic downgrade -1
   ```
