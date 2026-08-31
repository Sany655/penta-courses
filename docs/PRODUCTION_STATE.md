# Production State Record (Machine-Readable)

```yaml
system:
  app_name: "Unified Hybrid Adaptive Learning Platform"
  brand_name: "PentaCourse"
  brand_domain: "pentacourse.com"
  version: "1.0.0"
  status: "READY_FOR_DEPLOYMENT"

architecture:
  frontend_platform: "Next.js 16 (Vercel / Cloudflare Pages)"
  backend_platform: "FastAPI / Python (Railway / Render / Docker)"
  database_authoritative: "Managed PostgreSQL 15+ (Supabase / Neon / Railway / AWS RDS)"
  database_client_offline: "SQLite / Local Storage with Outbox Sync Queue"
  ai_provider: "Google Gemini API (Server-Side Isolation)"
  storage_provider: "AWS S3 / Cloudflare R2"

verification_metrics:
  total_backend_tests: 35
  passed_backend_tests: 35
  failed_backend_tests: 0
  frontend_oxlint_errors: 0
  production_smoke_test_status: "PASSED (3/3)"

monetization:
  stripe_status: "CONFIGURED_LIVE_READY"
  bkash_status: "CONFIGURED_LIVE_READY"
  currencies_supported:
    - "USD"
    - "BDT"
  products_configured:
    - "tier-free-adaptive"
    - "tier-pro-mission"
    - "course tracks"
    - "module-bypass"
    - "certificates"

seo_and_discovery:
  robots_txt: "CONFIGURED"
  sitemap_xml: "CONFIGURED"
  open_graph_metadata: "CONFIGURED"
  structured_data_schemas:
    - "Organization"
    - "WebSite"
    - "Course"
    - "FAQPage"

offline_sync:
  push_endpoint: "/api/v1/sync/push"
  pull_endpoint: "/api/v1/sync/pull"
  conflict_resolution: "Server-Authoritative Sequence Stamping"

trust_and_safety:
  clinical_disclaimer_status: "ACTIVE"
  certificate_public_verification: "ACTIVE (/certificates/[hash])"
  terms_of_service: "ACTIVE (/terms)"
  privacy_policy: "ACTIVE (/privacy)"
  refund_policy: "ACTIVE (/refund)"

rollback_procedure:
  frontend: "Instant Vercel rollback"
  backend: "Docker image rollback"
  database: "alembic downgrade -1"
```
