import os

with open('backend/tests/test_end_to_end_integration.py', 'r', encoding='utf-8') as f:
    code = f.read()

old_s2 = """    # Step 2: Initialize 5-Dimensional Learner State
    concepts = db.query(m.Concept).filter(m.Concept.domain_id == med_domain.id).all()
    c_abg = next(c for c in concepts if 'ABG' in c.name or 'Arterial Blood Gas' in c.name)
    c_dka = next(c for c in concepts if 'DKA' in c.name or 'Diabetic Ketoacidosis' in c.name)

    LearnerStateService.update_learner_concept_state(
        db, student.id, c_abg.id,
        evidence_type=m.EvidenceType.PROBLEM_SOLVING,
        is_successful=True,
        raw_score=0.92,
        time_spent_seconds=120
    )
    s_abg = LearnerStateService.get_or_create_concept_state(db, student.id, c_abg.id)
    assert s_abg.mastery >= 0.85"""

new_s2 = """    # Step 2: Initialize 5-Dimensional Learner State
    concepts = db.query(m.Concept).filter(m.Concept.domain_id == med_domain.id).all()
    c_abg = next(c for c in concepts if 'ABG' in c.name or 'Arterial Blood Gas' in c.name)
    c_dka = next(c for c in concepts if 'DKA' in c.name or 'Diabetic Ketoacidosis' in c.name)

    s_abg = LearnerStateService.record_diagnostic_mastery(
        db, student.id, c_abg.id, mastery_level=0.92
    )
    assert s_abg.mastery >= 0.85"""

code = code.replace(old_s2, new_s2)
with open('backend/tests/test_end_to_end_integration.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated step 2 in test_end_to_end_integration.py!')
