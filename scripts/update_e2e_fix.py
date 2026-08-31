import os

with open('backend/tests/test_end_to_end_integration.py', 'r', encoding='utf-8') as f:
    code = f.read()

old_fixture = """@pytest.fixture(scope='module')
def db():
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    seed_all()
    yield session
    session.close()"""

new_fixture = """@pytest.fixture(scope='module')
def db():
    Base.metadata.create_all(bind=engine)
    seed_all()
    session = SessionLocal()
    yield session
    session.close()"""

code = code.replace(old_fixture, new_fixture)
with open('backend/tests/test_end_to_end_integration.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated fixture in test_end_to_end_integration.py!')
