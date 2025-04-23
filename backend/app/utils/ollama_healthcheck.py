import requests

def check_ollama_health():
    try:
        response = requests.get("http://127.0.0.1:11434/api/tags", timeout=5)
        if response.status_code == 200:
            models = response.json().get("models", [])
            model_names = [model.get("name", "") for model in models]
            if any("deepseek-coder" in name for name in model_names):
                print("✅ Ollama server is healthy and DeepSeek-Coder model is available!")
                return True
            else:
                print("❌ Ollama server is running but DeepSeek-Coder model is missing.")
                return False
        else:
            print(f"❌ Unexpected status code from Ollama API: {response.status_code}")
            return False
    except requests.RequestException as e:
        print(f"❌ Failed to connect to Ollama server: {e}")
        return False

if __name__ == "__main__":
    check_ollama_health()
