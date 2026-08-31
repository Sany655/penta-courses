import sqlite3
import os

db_path = 'learning_os.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    cur.execute('PRAGMA table_info(projects);')
    p_cols = [r[1] for r in cur.fetchall()]
    print('Current projects columns:', p_cols)
    
    if 'user_id' not in p_cols:
        cur.execute("ALTER TABLE projects ADD COLUMN user_id VARCHAR(36);")
        print('Added user_id to projects')
    if 'title' not in p_cols:
        cur.execute("ALTER TABLE projects ADD COLUMN title VARCHAR(255);")
        print('Added title to projects')
    if 'status' not in p_cols:
        cur.execute("ALTER TABLE projects ADD COLUMN status VARCHAR(50) DEFAULT 'ACTIVE';")
        print('Added status to projects')
    if 'completed_at' not in p_cols:
        cur.execute("ALTER TABLE projects ADD COLUMN completed_at DATETIME;")
        print('Added completed_at to projects')
    if 'updated_at' not in p_cols:
        cur.execute("ALTER TABLE projects ADD COLUMN updated_at DATETIME;")
        print('Added updated_at to projects')

    cur.execute('PRAGMA table_info(project_tasks);')
    t_cols = [r[1] for r in cur.fetchall()]
    print('Current project_tasks columns:', t_cols)

    if 'concept_id' not in t_cols:
        cur.execute("ALTER TABLE project_tasks ADD COLUMN concept_id VARCHAR(36);")
        print('Added concept_id to project_tasks')
    if 'task_order' not in t_cols:
        cur.execute("ALTER TABLE project_tasks ADD COLUMN task_order INTEGER DEFAULT 1;")
        print('Added task_order to project_tasks')
    if 'status' not in t_cols:
        cur.execute("ALTER TABLE project_tasks ADD COLUMN status VARCHAR(50) DEFAULT 'PENDING';")
        print('Added status to project_tasks')
    if 'score' not in t_cols:
        cur.execute("ALTER TABLE project_tasks ADD COLUMN score FLOAT;")
        print('Added score to project_tasks')
    if 'rubric_json' not in t_cols:
        cur.execute("ALTER TABLE project_tasks ADD COLUMN rubric_json JSON DEFAULT '{}';")
        print('Added rubric_json to project_tasks')
    if 'submission_json' not in t_cols:
        cur.execute("ALTER TABLE project_tasks ADD COLUMN submission_json JSON DEFAULT '{}';")
        print('Added submission_json to project_tasks')
    if 'completed_at' not in t_cols:
        cur.execute("ALTER TABLE project_tasks ADD COLUMN completed_at DATETIME;")
        print('Added completed_at to project_tasks')

    conn.commit()
    conn.close()
    print('Projects and ProjectTasks schema successfully migrated!')
