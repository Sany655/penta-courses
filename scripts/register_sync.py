import os

with open('backend/app/api/v1/router.py', 'r', encoding='utf-8') as f:
    code = f.read()

if 'from backend.app.api.v1.sync import router as sync_router' not in code:
    code = code.replace(
        'from backend.app.api.v1.system import router as system_router',
        'from backend.app.api.v1.system import router as system_router\nfrom backend.app.api.v1.sync import router as sync_router'
    )
    code = code.replace(
        'api_router.include_router(system_router)',
        'api_router.include_router(system_router)\napi_router.include_router(sync_router)'
    )
    with open('backend/app/api/v1/router.py', 'w', encoding='utf-8') as f:
        f.write(code)
    print('Registered sync_router in router.py!')
else:
    print('sync_router already registered.')
