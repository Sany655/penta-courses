# Operations, Backup & Disaster Recovery Guide

## 1. Automated PostgreSQL Database Backups

### Nightly Backup Script (Cron / Cloud Task)
```bash
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_pentacourse_${TIMESTAMP}.sql.gz"

# Dump and compress PostgreSQL authoritative ledger
pg_dump "$DATABASE_URL" | gzip > "/tmp/${BACKUP_FILE}"

# Upload to S3 / Cloudflare R2 backup bucket
aws s3 cp "/tmp/${BACKUP_FILE}" "s3://${OBJECT_STORAGE_BUCKET}/backups/${BACKUP_FILE}"

# Remove temporary local file
rm "/tmp/${BACKUP_FILE}"
echo "Database backup ${BACKUP_FILE} completed and uploaded."
```

### Database Restore Procedure
```bash
# 1. Download backup archive
aws s3 cp "s3://${OBJECT_STORAGE_BUCKET}/backups/backup_pentacourse_YYYYMMDD_HHMMSS.sql.gz" ./backup.sql.gz

# 2. Restore into target PostgreSQL database
gunzip -c backup.sql.gz | psql "$DATABASE_URL"
```

---

## 2. Health Monitoring & Alerting

- **Liveness Endpoint**: `GET /health` (Returns JSON with `status: "healthy"`, DB connectivity, and version).
- **Deep System Health**: `GET /api/v1/system/health` (Performs active table counts and latency checks).
- **Error Tracking**: Configure `SENTRY_DSN` for automated real-time exception reporting.
