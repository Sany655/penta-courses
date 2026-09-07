import json
import uuid
from backend.app.core.database import SessionLocal, Base, engine
import backend.app.models as m
from backend.app.core.security import get_password_hash

def get_or_create_domain(db, name, slug, description, difficulty):
    domain = db.query(m.Domain).filter((m.Domain.slug == slug) | (m.Domain.name == name)).first()
    if not domain:
        domain = m.Domain(name=name, slug=slug, description=description, difficulty=difficulty, status='PUBLISHED')
        db.add(domain)
        db.flush()
    return domain

def get_or_create_concept(db, domain_id, name, slug, concept_type, difficulty, importance):
    concept = db.query(m.Concept).filter(m.Concept.domain_id == domain_id, (m.Concept.slug == slug) | (m.Concept.name == name)).first()
    if not concept:
        concept = m.Concept(domain_id=domain_id, name=name, slug=slug, type=concept_type, difficulty=difficulty, importance=importance)
        db.add(concept)
        db.flush()
    return concept

def seed_all():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # 1. Admin & Demo Users
    admin_user = db.query(m.User).filter(m.User.email == 'admin@pentacourse.com').first()
    if not admin_user:
        admin_user = m.User(
            email='admin@pentacourse.com',
            hashed_password=get_password_hash('AdminMaster2026!'),
            full_name='Master Administrator',
            role=m.UserRole.ADMIN,
            is_active=True
        )
        db.add(admin_user)
        db.flush()
        db.add(m.LearnerProfile(user_id=admin_user.id, learning_mode='HYBRID', challenge_preference=0.9))
    else:
        admin_user.role = m.UserRole.ADMIN

    demo_user = db.query(m.User).filter(m.User.email == 'demo@pentacourse.com').first()
    if not demo_user:
        demo_user = m.User(
            email='demo@pentacourse.com',
            hashed_password=get_password_hash('DemoStudent2026!'),
            full_name='Alex Rivera (Hybrid Learner)',
            role=m.UserRole.USER,
            is_active=True
        )
        db.add(demo_user)
        db.flush()
        db.add(m.LearnerProfile(user_id=demo_user.id, learning_mode='ADAPTIVE_ONLY', challenge_preference=0.75))
    else:
        demo_user.role = m.UserRole.USER

    # 2. Clinical Medicine
    med = get_or_create_domain(db, 'Clinical Medicine & Differential Pathophysiology', 'clinical-medicine', 'Physiological causal networks, ABG interpretation, and acute resuscitation algorithms.', 0.85)
    c_abg = get_or_create_concept(db, med.id, 'Arterial Blood Gas Analysis', 'abg-analysis', m.ConceptType.FOUNDATION, 0.5, 1.0)
    c_ag = get_or_create_concept(db, med.id, 'Anion Gap Calculation', 'anion-gap', m.ConceptType.FOUNDATION, 0.6, 0.9)
    c_hagma = get_or_create_concept(db, med.id, 'High Anion Gap Metabolic Acidosis (HAGMA)', 'hagma', m.ConceptType.PRINCIPLE, 0.75, 0.95)
    c_dka = get_or_create_concept(db, med.id, 'Diabetic Ketoacidosis (DKA) Pathogenesis', 'dka-pathogenesis', m.ConceptType.THEORY, 0.8, 1.0)
    c_resusc = get_or_create_concept(db, med.id, 'Acute DKA Fluid & Electrolyte Resuscitation', 'dka-resuscitation', m.ConceptType.TECHNIQUE, 0.9, 1.0)

    # 3. Constitutional Law
    law = get_or_create_domain(db, 'Constitutional Law & Jurisprudential Logic', 'constitutional-law', 'Judicial review standards, levels of scrutiny, and Bill of Rights adjudication.', 0.8)
    c_jr = get_or_create_concept(db, law.id, 'Judicial Review & Article III Standing', 'judicial-review', m.ConceptType.FOUNDATION, 0.4, 1.0)
    c_ep = get_or_create_concept(db, law.id, 'Equal Protection Clause', 'equal-protection', m.ConceptType.THEORY, 0.65, 0.95)
    c_ss = get_or_create_concept(db, law.id, 'Strict Scrutiny vs Rational Basis Tiers', 'scrutiny-tiers', m.ConceptType.TECHNIQUE, 0.8, 1.0)

    # 4. Macroeconomics & Quantitative Finance
    econ = get_or_create_domain(db, 'Macroeconomics & Quantitative Finance', 'macro-finance', 'Central bank interest rate transmission, yield curve dynamics, and liquidity preference.', 0.8)
    c_cb = get_or_create_concept(db, econ.id, 'Central Bank Policy Rate & Reserves', 'policy-rate', m.ConceptType.FOUNDATION, 0.5, 0.95)
    c_yc = get_or_create_concept(db, econ.id, 'Yield Curve Structure & Term Premia', 'yield-curve', m.ConceptType.THEORY, 0.75, 1.0)

    # 5. Python Systems Architecture
    py = get_or_create_domain(db, 'Python Systems & High Concurrency Architecture', 'python-systems', 'CPython GIL mechanics, AsyncIO event loops, distributed Redis Redlock, and memory management.', 0.85)
    c_gil = get_or_create_concept(db, py.id, 'CPython Global Interpreter Lock (GIL)', 'gil-mechanics', m.ConceptType.FOUNDATION, 0.7, 1.0)
    c_async = get_or_create_concept(db, py.id, 'AsyncIO Cooperative Multitasking', 'asyncio-eventloop', m.ConceptType.THEORY, 0.75, 0.95)
    c_lock = get_or_create_concept(db, py.id, 'Distributed Redlock Consensus', 'distributed-redlock', m.ConceptType.TECHNIQUE, 0.9, 0.9)

    # 6. Structured Curriculum Tracks & Lessons
    seed_courses(db)

    db.commit()
    db.close()
    print('Idempotently seeded all 4 multi-domain knowledge graphs, activities, and curriculum tracks!')

def seed_courses(db):
    from backend.app.seeds.courses_data import COURSES_SEED_DATA
    for c_data in COURSES_SEED_DATA:
        course_id = c_data['id']
        domain_slug = c_data.get('domain_slug')
        domain = db.query(m.Domain).filter(m.Domain.slug == domain_slug).first() if domain_slug else None

        course = db.query(m.Course).filter((m.Course.id == course_id) | (m.Course.slug == c_data['slug'])).first()
        price_in_cents = int(round(c_data.get('price', 49.99) * 100)) if 'price' in c_data else c_data.get('price_in_cents', 4999)
        stats = c_data.get('stats', {})
        if 'skills' in c_data:
            stats['skills'] = c_data['skills']

        if not course:
            course = m.Course(
                id=course_id,
                domain_id=domain.id if domain else None,
                title=c_data['title'],
                slug=c_data['slug'],
                description=c_data.get('description', ''),
                category=c_data.get('category', 'GENERAL'),
                difficulty=c_data.get('difficulty', 'Intermediate'),
                price_in_cents=price_in_cents,
                is_published=True,
                instructor_name=c_data.get('instructor_name', 'Faculty Lead'),
                thumbnail_url=c_data.get('thumbnail_url'),
                stats_json=stats
            )
            db.add(course)
            db.flush()
        else:
            course.title = c_data['title']
            course.description = c_data.get('description', '')
            course.price_in_cents = price_in_cents
            course.stats_json = stats
            if domain and not course.domain_id:
                course.domain_id = domain.id

        # Seed Modules
        for mod_idx, mod_data in enumerate(c_data.get('modules', [])):
            mod_id = mod_data['id']
            module = db.query(m.Module).filter(m.Module.id == mod_id).first()
            bypass_fee_cents = int(round(mod_data.get('bypassFee', 2.99) * 100)) if 'bypassFee' in mod_data else mod_data.get('bypass_fee_in_cents', 299)
            quiz_json = mod_data.get('quiz', {})

            if not module:
                module = m.Module(
                    id=mod_id,
                    course_id=course.id,
                    title=mod_data['title'],
                    order_index=mod_idx,
                    bypass_fee_in_cents=bypass_fee_cents,
                    quiz_json=quiz_json
                )
                db.add(module)
                db.flush()
            else:
                module.title = mod_data['title']
                module.order_index = mod_idx
                module.bypass_fee_in_cents = bypass_fee_cents
                module.quiz_json = quiz_json

            # Seed Lessons
            for les_idx, les_data in enumerate(mod_data.get('lessons', [])):
                les_id = les_data['id']
                lesson = db.query(m.Lesson).filter(m.Lesson.id == les_id).first()
                title = les_data.get('title') or les_data.get('metadata', {}).get('lessonTitle') or f'Lesson {mod_idx+1}.{les_idx+1}'
                blocks = les_data.get('blocks', [])
                if not blocks and 'block' in les_data:
                    blocks = [les_data['block']]

                if not lesson:
                    lesson = m.Lesson(
                        id=les_id,
                        module_id=module.id,
                        title=title,
                        order_index=les_idx,
                        duration_minutes=20,
                        content_blocks=blocks
                    )
                    db.add(lesson)
                else:
                    lesson.title = title
                    lesson.order_index = les_idx
                    lesson.content_blocks = blocks

if __name__ == '__main__':
    seed_all()
