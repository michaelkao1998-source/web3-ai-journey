import requests 
import os
import json


API_URL = "https://openrouter.ai/api/v1"

def ask_ai(prompt, model="gpt-4o-mini"):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}"
    }
    data = {
        "model": model,
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }
    response = requests.post(API_URL, headers=headers, json=data)
    return response.json()

if __name__ == "__main__":
    prompt = "Explain this ABI:"
    response = ask_ai(prompt)
    if "choices" in response:
        print(response["choices"][0]["message"]["content"])
    else:
        print("Error:", response)
