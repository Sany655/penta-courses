import os

with open('backend/tests/test_end_to_end_integration.py', 'r', encoding='utf-8') as f:
    code = f.read()

old_s7 = """    # Step 7: Capstone Project & Applied Creation Mode
    project = m.Project(
        domain_id=med_domain.id,
        name='Full ICU Resuscitation Protocol Implementation',
        scope='CAPSTONE',
        status='ACTIVE'
    )
    db.add(project)
    db.flush()

    t1 = m.ProjectTask(project_id=project.id, title='Electrolyte Calculation Script', required_concepts=[c_dka.id])
    db.add(t1)
    db.commit()

    eval_res = ProjectEngineService.evaluate_task_submission(
        db, student.id, t1.id,
        submission_payload={'protocol_steps': ['Insulin', 'Saline', 'KCl']},
        rubric_scores={'accuracy': 1.0, 'safety': 0.95}
    )
    assert eval_res['passed'] is True
    assert eval_res['creation_strength'] >= 0.80"""

new_s7 = """    # Step 7: Capstone Project & Applied Creation Mode
    project = m.Project(
        user_id=student.id,
        domain_id=med_domain.id,
        name='Full ICU Resuscitation Protocol Implementation',
        scope='CAPSTONE',
        status='ACTIVE'
    )
    db.add(project)
    db.flush()

    t1 = m.ProjectTask(project_id=project.id, concept_id=c_dka.id, title='Electrolyte Calculation Script', required_concepts=[c_dka.id])
    db.add(t1)
    db.commit()

    eval_res = ProjectEngineService.evaluate_milestone_task(
        db, student.id, t1.id,
        submission_data={'score': 1.0, 'verified': True, 'protocol_steps': ['Insulin', 'Saline', 'KCl']}
    )
    assert eval_res['passed'] is True
    assert eval_res['task_status'] == 'VERIFIED'"""

code = code.replace(old_s7, new_s7)
with open('backend/tests/test_end_to_end_integration.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated step 7 in test_end_to_end_integration.py!')
