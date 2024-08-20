import requests
from faker import Faker

# Initialize the Faker object
fake = Faker()

BASE_URL = "http://localhost:4000/api/v1/auth"  # Replace with your API's base URL

# Generate fake username and password
fake_email = fake.email()
fake_password = fake.password(length=10, special_chars=True, digits=True, upper_case=True, lower_case=True)

def test_register():
    url = f"{BASE_URL}/register"
    payload = {
        "email": fake_email,
        "password": fake_password
    }
    response = requests.post(url, json=payload)
    print(response.json())
    assert response.status_code == 201, f"Expected 201, got {response.status_code}"
    print("Success")
    cookies = response.cookies
    assert 'session_id' in cookies, "Expected 'session_id' in cookies"
    print(cookies)
    print("Register Test Passed:", response.json())
    return response.json()['user']['username']

def test_login(username):
    url = f"{BASE_URL}/login"
    payload = {
        "login": fake_email,
        "password": fake_password
    }
    response = requests.post(url, json=payload)
    
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    assert response.json()['user']['username'] == username, f"Expected username {username}, got {response.json()['user']['username']}"
    cookies = response.cookies
    print(cookies)
    assert 'session_id' in cookies, "Expected 'session_id' in cookies"
    print("Login Test Passed:", response.json())

def test_login_withUsername(username):
    url = f"{BASE_URL}/login"
    payload = {
        "login": username,
        "password": fake_password
    }
    response = requests.post(url, json=payload)
    
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    cookies = response.cookies
    assert 'session_id' in cookies, "Expected 'session_id' in cookies"
    print("Login Test Passed:", response.json())
    print(cookies)
    return cookies['session_id']

def test_get_me(session_id):
    url = f"{BASE_URL}/me"
    cookies = {'session_id': session_id}
    response = requests.get(url, cookies=cookies)
    print(response.json())
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    cookies = response.cookies
    print(cookies)
    assert 'session_id' in cookies, "Expected 'session_id' in cookies"
    return cookies['session_id']

def test_logout(session_id):
    url = f"{BASE_URL}/logout"
    cookies = {'session_id': session_id}
    response = requests.post(url, cookies=cookies)
    print(response.json())
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"

if __name__ == "__main__":
    for i in range(2):
        fake_email = fake.email()
        fake_password = fake.password(length=10, special_chars=True, digits=True, upper_case=True, lower_case=True)
        username = test_register()
        # test_login(username)
        # session_id = test_login_withUsername(username)
        # session_id = test_get_me(session_id)
        # test_logout(session_id)

