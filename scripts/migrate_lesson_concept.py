import sqlite3

conn = sqlite3.connect('learning_os.db')
cur = conn.cursor()
cur.execute('PRAGMA table_info(lessons);')
l_cols = [r[1] for r in cur.fetchall()]
if 'concept_id' not in l_cols:
    cur.execute("ALTER TABLE lessons ADD COLUMN concept_id VARCHAR(36);")
    print('Added concept_id to lessons')
conn.commit()
conn.close()
print('Migrated concept_id on lessons table')
