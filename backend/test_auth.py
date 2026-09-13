import requests
import json
import urllib3

urllib3.disable_warnings()

base_url = "http://localhost:5000"

def get_token(email, password):
    login_url = f"{base_url}/api/users/login"
    payload = {
        "email": email,
        "password": password
    }
    try:
        response = requests.post(login_url, json=payload, verify=False)
        if response.status_code == 200:
            data = response.json()
            return data.get("token")
        else:
            print(f"Login failed: {response.text}")
            return None
    except Exception as e:
        print(f"Error during login: {e}")
        return None

def get_categories(token):
    url = f"{base_url}/api/categories"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        # Get should work for anyone
        print("Testing GET /categories...")
        response = requests.get(url, headers=headers, verify=False)
        print(f"Status Code: {response.status_code}")
        
        # Post should only work for Admin
        print("\nTesting POST /categories...")
        post_response = requests.post(url, headers=headers, json={"categoryName": "Test", "imageUrl": "test"}, verify=False)
        print(f"Status Code: {post_response.status_code}")
        
    except Exception as e:
         print(f"Error fetching categories: {e}")

if __name__ == "__main__":
    # The default admin credentials from a standard configuration, though usually hashed
    # Let's try attempting to create a user first so we have a known entity
    
    register_url = f"{base_url}/api/users"
    register_payload = {
        "name": "Admin Test",
        "email": "admin test@test.com",
        "passwordHash": "password123",
        "role": "Admin"
    }
    print("Registering Admin User...")
    requests.post(register_url, json=register_payload, verify=False)
    
    token = get_token("admin test@test.com", "password123")
    if token:
        print(f"Obtained Token: {token[:20]}...")
        get_categories(token)

