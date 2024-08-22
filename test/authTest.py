import requests
from faker import Faker
import time

# Initialize the Faker object
fake = Faker()

BASE_URL = "http://localhost:4000/api/v1/"  # Replace with your API's base URL

# Generate fake username and password
fake_email = fake.email()
fake_password = fake.password(length=10, special_chars=True, digits=True, upper_case=True, lower_case=True)

def test_register():
    url = f"{BASE_URL}/auth/register"
    payload = {
        "email": fake_email,
        "password": fake_password
    }
    response = requests.post(url, json=payload)
    assert response.status_code == 201, f"Expected 201, got {response.status_code}"
    cookies = response.cookies
    assert 'session_id' in cookies, "Expected 'session_id' in cookies"
    print(cookies)
    print("Register Test Passed:", response.json())
    return response.json()['user']['username']

def test_mobile_register():
    url = f"{BASE_URL}/mobile/auth/register"
    payload = {
        "email": fake_email,
        "password": fake_password
    }
    response = requests.post(url, json=payload)
    assert response.status_code == 201, f"Expected 201, got {response.status_code}"
    cookies = response.cookies
    assert 'accessToken' in cookies, "Expected 'accessToken' in cookies"
    assert 'refreshToken' in cookies, "Expected 'refreshToken' in cookies"
    print(cookies)
    print("Register Test Passed:", response.json())
    return response.json()['user']['username']

def test_login(username):
    url = f"{BASE_URL}/auth/login"
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

def test_mobile_login(username):
    url = f"{BASE_URL}/mobile/auth/login"
    payload = {
        "login": fake_email,
        "password": fake_password
    }
    response = requests.post(url, json=payload)
    
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    cookies = response.cookies
    assert 'accessToken' in cookies, "Expected 'accessToken' in cookies"
    assert 'refreshToken' in cookies, "Expected 'refreshToken' in cookies"
    print(cookies)
    print("Login Test Passed:", response.json())
    return cookies


def test_login_withUsername(username):
    url = f"{BASE_URL}/auth/login"
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
    url = f"{BASE_URL}/auth/me"
    cookies = {'session_id': session_id}
    response = requests.get(url, cookies=cookies)
    print(response.json())
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    cookies = response.cookies
    print(cookies)
    assert 'session_id' in cookies, "Expected 'session_id' in cookies"
    return cookies['session_id']

def test_mobile_get_me(access_token):
    url = f"{BASE_URL}/mobile/auth/me"
    headers = {'Authorization': f'Bearer {access_token}'}
    response = requests.get(url, headers=headers)
    
    print(response.json())
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"    
    return

def test_logout(session_id):
    url = f"{BASE_URL}/auth/logout"
    cookies = {'session_id': session_id}
    response = requests.post(url, cookies=cookies)
    print(response.json())
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"

def test_mobile_logout(access_token):
    url = f"{BASE_URL}/mobile/auth/logout"
    headers = {'Authorization': f'Bearer {access_token}'}
    response = requests.post(url, headers=headers)
    print(response.json())
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"

if __name__ == "__main__":
    for i in range(100):
        fake_email = fake.email()
        fake_password = fake.password(length=10, special_chars=True, digits=True, upper_case=True, lower_case=True)
        username = test_register()
        test_login(username)
        session_id = test_login_withUsername(username)
        session_id = test_get_me(session_id)
        test_logout(session_id)
        fake_email = fake.email()
        fake_password = fake.password(length=10, special_chars=True, digits=True, upper_case=True, lower_case=True)
        username = test_mobile_register()
        cookies = test_mobile_login(username)
        test_mobile_get_me(cookies['accessToken'])
        test_mobile_logout(session_id)


