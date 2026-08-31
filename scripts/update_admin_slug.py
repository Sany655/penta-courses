import os

with open('backend/app/services/admin_service.py', 'r', encoding='utf-8') as f:
    code = f.read()

old_code = """        else:
            domain.name = name
            domain.description = description
            domain.difficulty = difficulty
            domain.status = status"""

new_code = """        else:
            domain.name = name
            domain.slug = slug
            domain.description = description
            domain.difficulty = difficulty
            domain.status = status"""

code = code.replace(old_code, new_code)
with open('backend/app/services/admin_service.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated domain.slug assignment in AdminService!')
