import sqlite3

conn = sqlite3.connect('learning_os.db')
cur = conn.cursor()
cur.execute('PRAGMA table_info(project_tasks);')
t_cols = [r[1] for r in cur.fetchall()]
if 'created_at' not in t_cols:
    cur.execute("ALTER TABLE project_tasks ADD COLUMN created_at DATETIME;")
    print('Added created_at to project_tasks')
conn.commit()
conn.close()
print('Migrated created_at on project_tasks')
