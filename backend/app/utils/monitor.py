import requests

def check_backend_health(base_url="http://localhost:8000"):
    try:
        response = requests.get(f"{base_url}/health", timeout=3)
        return response.status_code == 200, response.json()
    except Exception:
        return False, None
