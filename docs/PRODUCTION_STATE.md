# Production State Record

```yaml
system:
  app_name: "Unified Hybrid Adaptive Learning Platform"
  brand_name: "Pentabrid Engine"
  version: "1.0.0"
  status: "READY_FOR_STAGING_VERIFICATION"

architecture:
  frontend: "Next.js 16 / Vercel-compatible"
  backend: "FastAPI / Python"
  database: "PostgreSQL production, SQLite development"
  authentication: "Backend JWT and server-controlled roles"
  client_authority: "Presentation only; business state is API-owned"

verified_in_workspace:
  next_build: "PASSED"
  focused_oxlint: "PASSED_WITH_EXISTING_FAST_REFRESH_WARNINGS"
  python_compile: "PASSED"
  alembic_fresh_database: "PASSED_TO_20260907_ADD_INQUIRIES"
  automated_pytest: "NO_TESTS_COLLECTED"

required_before_production:
  - "Configure production DATABASE_URL, SECRET_KEY, JWT_SECRET, and CORS_ORIGINS"
  - "Verify existing production schema before stamping the Alembic baseline"
  - "Run alembic upgrade head on staging and production"
  - "Run registration, login, role, inquiry, payment, admin, and certificate smoke tests"
  - "Configure and verify Stripe and bKash webhooks"
  - "Add automated backend API tests"
  - "Enable database backups and restore rehearsal"

external_services:
  ai: "Google Gemini server-side"
  payments: ["Stripe", "bKash"]
  storage: "Optional S3/R2 configuration"

health:
  deployment_endpoint: "/health"
  system_endpoint: "/api/v1/system/health"
  frontend_indicator: "Navigation server-status button, 60-second polling"
```
