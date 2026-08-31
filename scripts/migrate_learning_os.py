import sqlite3
import os

db_path = 'learning_os.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    cur.execute('PRAGMA table_info(goals);')
    cols = [r[1] for r in cur.fetchall()]
    print('Current goals columns in learning_os.db:', cols)
    
    if 'target_concept_ids' not in cols:
        cur.execute("ALTER TABLE goals ADD COLUMN target_concept_ids JSON DEFAULT '[]';")
        print('Added target_concept_ids')
    if 'target_skill_ids' not in cols:
        cur.execute("ALTER TABLE goals ADD COLUMN target_skill_ids JSON DEFAULT '[]';")
        print('Added target_skill_ids')
    if 'progress' not in cols:
        cur.execute("ALTER TABLE goals ADD COLUMN progress FLOAT DEFAULT 0.0;")
        print('Added progress')
    if 'completed_at' not in cols:
        cur.execute("ALTER TABLE goals ADD COLUMN completed_at DATETIME;")
        print('Added completed_at')
        
    conn.commit()
    conn.close()
    print('learning_os.db goals schema successfully migrated!')
