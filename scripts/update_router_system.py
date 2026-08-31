import os

with open('backend/app/api/v1/router.py', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace(
    'from backend.app.api.v1.telemetry import router as telemetry_router',
    'from backend.app.api.v1.telemetry import router as telemetry_router\nfrom backend.app.api.v1.system import router as system_router'
)
code = code.replace(
    'api_router.include_router(telemetry_router)',
    'api_router.include_router(telemetry_router)\napi_router.include_router(system_router)'
)

with open('backend/app/api/v1/router.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Registered system_router in router.py!')
