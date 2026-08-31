import os

with open('backend/app/api/v1/tracks.py', 'r', encoding='utf-8') as f:
    code = f.read()

new_endpoint = """@router.get('/courses')
def list_courses(db: Session = Depends(get_db)):
    courses = db.query(m.Course).filter(m.Course.is_published == True).all()
    return [
        {
            "id": c.id,
            "title": c.title,
            "slug": c.slug,
            "description": c.description,
            "price_in_cents": c.price_in_cents,
            "difficulty": c.difficulty,
            "category": c.category
        }
        for c in courses
    ]

@router.get('/courses/{course_id}/progress')"""

code = code.replace("@router.get('/courses/{course_id}/progress')", new_endpoint)
with open('backend/app/api/v1/tracks.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Added list_courses endpoint to tracks.py!')
