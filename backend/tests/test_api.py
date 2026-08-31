import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json()['status'] == 'healthy'

def test_list_domains():
    response = client.get('/api/v1/domains')
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 1

def test_list_courses():
    response = client.get('/api/v1/courses')
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 1

def test_auth_register_and_me():
    email = 'auto_test_user@pentacourse.com'
    register_res = client.post('/api/v1/auth/register', json={
        'email': email,
        'password': 'StrongPassword123!',
        'full_name': 'Automated Test User'
    })
    # Either 200 or 400 if already registered
    if register_res.status_code == 200:
        token = register_res.json()['access_token']
    else:
        login_res = client.post('/api/v1/auth/login', json={
            'email': email,
            'password': 'StrongPassword123!'
        })
        assert login_res.status_code == 200
        token = login_res.json()['access_token']
    
    me_res = client.get('/api/v1/auth/me', headers={'Authorization': f'Bearer {token}'})
    assert me_res.status_code == 200
    assert me_res.json()['email'] == email
