import os

with open('docs/ARCHITECTURE.md', 'r', encoding='utf-8') as f:
    arch_text = f.read()

sync_section = """

---

## 6. State Authority & Offline Client Sync Architecture

```
                     SERVER
                 PostgreSQL
            AUTHORITATIVE STATE LEDGER
            (22 Models, Evidence Ledger,
             Audit Logs, Certificates)
                       ▲
                       │  Bidirectional HTTPS Sync
                       │  (Vector Clock / Monotonic Sequence)
                       ▼
                LOCAL CLIENT DEVICE
                   SQLite
            OFFLINE PROJECTION & EVENT QUEUE
            (Local Caching, Immediate Offline Block
             Interactions, Pending Sync Queue)
```

### State Authority Principles
1. **Server Authoritative Store (PostgreSQL)**:
   - Contains the single source of truth for 5-D learner states, evidence ledger, transaction entitlements, certificates, and graph definitions.
   - Resolves merge conflicts deterministically using monotonic event sequence IDs and server-stamped timestamps.
2. **Local Client Device Store (SQLite / IndexedDB)**:
   - Serves as an **offline projection** and interactive cache.
   - When offline (on Windows Desktop, Android, or Browser PWA), user interactions, block telemetry, and exercise attempts are appended to a local pending event queue (`local_learning_events`).
   - Upon reconnecting, the client replays pending events to `/api/v1/telemetry/events` and `/api/v1/sessions/{id}/attempts`, receiving the authoritative reconciled learner state delta.
"""

if 'State Authority & Offline Client Sync Architecture' not in arch_text:
    arch_text += sync_section
    with open('docs/ARCHITECTURE.md', 'w', encoding='utf-8') as f:
        f.write(arch_text)
    print('Updated ARCHITECTURE.md with server/local sync architecture!')
else:
    print('Sync section already present.')
