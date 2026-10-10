
import requests

url = "http://localhost:11434/api/generate"

payload = {
    "model": "qwen3:4b",
    "prompt": "Reply with just Hello",
    "stream": False,
    "think": False,
    "options": {
        "num_predict": 10
    }
}

try:
    print("Connecting to Ollama...")

    response = requests.post(
        url,
        json=payload,
        timeout=300
    )

    response.raise_for_status()

    result = response.json()
    print("Ollama response:", result.get("response"))

except requests.RequestException as error:
    print("Connection failed:", error)