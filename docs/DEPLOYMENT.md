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

The variable must be configured where FastAPI runs. A local root `.env` file is not automatically loaded by the current application. For Vercel, add `DATABASE_URL` under **Project Settings -> Environment Variables -> Production**, then redeploy. For Railway or Render, add it to the backend service environment variables.

After deployment, check:

```text
https://your-api-domain.com/health
```

Healthy output includes `status: "healthy"` and `database: "connected"`. If the API responds with `status: "degraded"`, the API is reachable but PostgreSQL is not; `database_error` reports the driver error class without exposing credentials.

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

### D. Vercel Authentication Variables
Registration and credentials login use the FastAPI backend, PostgreSQL, PBKDF2-SHA256 password hashes, and signed JWTs. Firebase Authentication, Google authentication, and NextAuth are not required for account access. Add these variables to the backend deployment and the frontend Vercel project as appropriate:

```bash
JWT_SECRET=<long-random-secret>
SECRET_KEY=<long-random-secret>
DATABASE_URL=postgresql+psycopg2://...
NEXT_PUBLIC_API_URL=https://api.pentacourse.com
```

Generate secrets with `openssl rand -base64 32`. The frontend does not require Firebase or Google authentication credentials. Keep database credentials and signing secrets only in the backend deployment environment.

---

## 3. Database Migration & Seeding Commands

```bash
# From the backend directory, run migrations against the configured DATABASE_URL.
cd backend
alembic upgrade head

# Seed the four multi-domain knowledge graphs after the schema is ready.
python -c "from backend.app.seeds.seed_data import seed_all; seed_all()"
```

The migration chain now includes `20260907_baseline` for the existing SQLAlchemy schema followed by `20260907_add_inquiries` for persistent contact inquiries. For a new database, `alembic upgrade head` creates the complete schema. For an existing database that was created outside Alembic, verify it matches the models, run `alembic stamp 20260907_baseline`, then run `alembic upgrade head` to add inquiries. Never run the baseline upgrade against an existing database without checking its schema first.

Before enabling production traffic, verify:

```bash
python -c "from backend.app.main import app; print(app.title)"
python -c "from backend.app.core.config import settings; settings.validate_production_secrets(); print('production secrets valid')"
```

Manual bKash submissions, payment review, entitlements, and admin grants use the existing commerce tables and FastAPI admin endpoints.

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
