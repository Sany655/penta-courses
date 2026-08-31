import sqlite3

conn = sqlite3.connect('learning_os.db')
cur = conn.cursor()
cur.execute('PRAGMA table_info(module_bypasses);')
cols = [r[1] for r in cur.fetchall()]
if 'bypass_type' not in cols:
    cur.execute("ALTER TABLE module_bypasses ADD COLUMN bypass_type VARCHAR(50) DEFAULT 'EXAM_PASSED';")
    print('Added bypass_type to module_bypasses')
if 'score' not in cols:
    cur.execute("ALTER TABLE module_bypasses ADD COLUMN score FLOAT DEFAULT 1.0;")
    print('Added score to module_bypasses')
if 'unlocked_at' not in cols:
    cur.execute("ALTER TABLE module_bypasses ADD COLUMN unlocked_at DATETIME;")
    print('Added unlocked_at to module_bypasses')
conn.commit()
conn.close()
print('Migrated module_bypasses table schema')
