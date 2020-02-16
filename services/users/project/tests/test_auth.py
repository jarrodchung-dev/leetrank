import json
import unittest

from flask import current_app
from project import db
from project.api.models import User
from project.tests.base import BaseTestCase
from project.tests.utils import add_user


class TestAuthBlueprint(BaseTestCase):
    
    def test_user_registration(self):
        """Ensures users can register via '/auth/registration' route."""
        with self.client:
            response = self.client.post(
                "/auth/register",
                data=json.dumps({
                    "username": "test_user",
                    "email": "test@user.com",
                    "password": "password",                
                }),
                content_type="application/json"
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data["status"] == "success")
            self.assertTrue(data["message"] == "Successfully registered.")
            self.assertTrue(data["auth_token"])
            self.assertTrue(response.content_type == "application/json")
            self.assertEqual(response.status_code, 201)
            
    def test_user_registration_duplicate_email(self):
        """Ensures error is thrown if email already exists."""
        add_user("test_user", "test@user.com", "password")
        with self.client:
            response = self.client.post(
                "/auth/register",
                data=json.dumps({
                    "username": "test_user",
                    "email": "test@user.com",
                    "password": "password"
                }),
                content_type="application/json",
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn("Sorry. That user already exists.", data["message"])
            self.assertIn("fail", data["status"])
            
    def test_user_registration_duplicate_username(self):
        """Ensures error is thrown if username already exists."""
        add_user("test_user", "test@user.com", "password")
        with self.client:
            response = self.client.post(
                "/auth/register",
                data=json.dumps({
                    "username": "test_user",
                    "email": "test2@user.com",
                    "password": "password",
                }),
                content_type="application/json",
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn("Sorry. That user already exists.", data["message"])
            self.assertIn("fail", data["status"])
    
    def test_user_registration_invalid_json(self):
        """Ensures error is thrown for registration with invalid JSON."""
        with self.client:
            response = self.client.post(
                "/auth/register",
                data=json.dumps({}),
                content_type="application/json",
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn("Invalid payload.", data["message"])
            self.assertIn("fail", data["status"])
    
    def test_user_registration_invalid_json_keys_no_username(self):
        """Ensures error is thrown if users register with no username."""
        with self.client:
            response = self.client.post(
                "/auth/register",
                data=json.dumps({
                    "email": "test@user.com",
                    "password": "password",        
                }),
                content_type="application/json",
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn("Invalid payload.", data["message"])
            self.assertIn("fail", data["status"])
    
    def test_user_registration_invalid_json_keys_no_email(self):
        """Ensures error is thrown if users register with no email."""
        with self.client:
            response = self.client.post(
                "/auth/register",
                data=json.dumps({
                    "username": "test_user",
                    "password": "password",                
                }),
                content_type="application/json",
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn("Invalid payload.", data["message"])
            self.assertIn("fail", data["status"])
    
    def test_user_registration_invalid_json_keys_no_password(self):
        """Ensures error is thrown if users register with non password."""
        with self.client:
            response = self.client.post(
                "/auth/register",
                data=json.dumps({
                    "username": "test_user",
                    "email": "test@user.com",               
                }),
                content_type="application/json",
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn("Invalid payload.", data["message"])
            self.assertIn("fail", data["status"])
            
    def test_registered_user_login(self):
        """Ensures registered users are able to login."""
        with self.client:
            add_user("test_user", "test@user.com", "password")
            response = self.client.post(
                "/auth/login",
                data=json.dumps({
                    "email": "test@user.com",
                    "password": "password"                
                }),
                content_type="application/json"
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data["status"] == "success")
            self.assertTrue(data["message"] == "Successfully logged in.")
            self.assertTrue(data["auth_token"])
            self.assertTrue(response.content_type == "application/json")
            self.assertEqual(response.status_code, 200)
    
    def test_not_registered_user_login(self):
        """
        Ensures error is thrown when non-registered users attempt to login.
        """
        with self.client:
            response = self.client.post(
                "/auth/login",
                data=json.dumps({
                    "email": "test@user.com",
                    "password": "password"                
                }),
                content_type="application/json"
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data["status"] == "fail")
            self.assertTrue(data["message"] == "User does not exist.")
            self.assertTrue(response.content_type == "application/json")
            self.assertEqual(response.status_code, 404)
    
    def test_valid_logout(self):
        """Ensures validated users can logout."""
        add_user("test_user", "test@user.com", "password")
        with self.client:
            response_login = self.client.post(
                "/auth/login",
                data=json.dumps({
                    "email": "test@user.com",
                    "password": "password"                
                }),
                content_type="application/json"
            )
            token = json.loads(response_login.data.decode())["auth_token"]
            response = self.client.get(
                "/auth/logout",
                headers={"Authorization": f"Bearer {token}"}
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data["status"] == "success")
            self.assertTrue(data["message"] == "Successfully logged out.")
            self.assertEqual(response.status_code, 200)
            
    def test_invalid_logout_expired_token(self):
        """Ensures error is thrown if users logout with expired auth tokens."""
        add_user("test_user", "test@user.com", "password")
        current_app.config["TOKEN_EXPIRATION_SECONDS"] = -1
        with self.client:
            response_login = self.client.post(
                "/auth/login",
                data=json.dumps({
                    "email": "test@user.com",
                    "password": "password"
                }),
                content_type="application/json"
            )
            token = json.loads(response_login.data.decode())["auth_token"]
            response = self.client.get(
                "/auth/logout",
                headers={"Authorization": f"Bearer {token}"}
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data["status"] == "fail")
            self.assertTrue(
                data["message"] == "Signature expired. Please log in again."
            )
            self.assertEqual(response.status_code, 401)

    def test_invalid_logout(self):
        """Ensures error is thrown if auth token is invalid."""
        with self.client:
            response = self.client.get(
                "/auth/logout",
                headers={"Authorization": f"Bearer invalid"}
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data["status"] == "fail")
            self.assertTrue(
                data["message"] == "Invalid token. Please log in again."
            )
            self.assertEqual(response.status_code, 401)
            
    def test_user_status(self):
        add_user("test_user", "test@user.com", "password")
        with self.client:
            response_login = self.client.post(
                "/auth/login",
                data=json.dumps({
                    "email": "test@user.com",
                    "password": "password"
                }),
                content_type="application/json"
            )
            token = json.loads(response_login.data.decode())["auth_token"]
            response = self.client.get(
                "/auth/status",
                headers={"Authorization": f"Bearer {token}"}
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data["status"] == "success")
            self.assertTrue(data["data"] is not None)
            self.assertTrue(data["data"]["username"] == "test_user")
            self.assertTrue(data["data"]["email"] == "test@user.com")
            self.assertTrue(data["data"]["active"] is True)
            self.assertFalse(data["data"]["admin"])
            self.assertEqual(response.status_code, 200)
            
    def test_invalid_status(self):
        with self.client:
            response = self.client.get(
                "/auth/status",
                headers={"Authorization": "Bearer invalid"}
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data["status"] == "fail")
            self.assertTrue(
                data["message"] == "Invalid token. Please log in again."
            )
            self.assertEqual(response.status_code, 401)
    
    def test_invalid_logout_inactive(self):
        add_user("test_user", "test@user.com", "password")
        user = User.query.filter_by(email="test@user.com").first()
        user.active = False
        db.session.commit()
        with self.client:
            response_login = self.client.post(
                "/auth/login",
                data=json.dumps({
                    "email": "test@user.com",
                    "password": "password"
                }),
                content_type="application/json"
            )
            token = json.loads(response_login.data.decode())["auth_token"]
            response = self.client.get(
                "/auth/logout",
                headers={"Authorization": f"Bearer {token}"}
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data["status"] == "fail")
            self.assertTrue(data["message"] == "Provide a valid auth token.")
            self.assertEqual(response.status_code, 401)
            
    def test_invalid_status_inactive(self):
        add_user("test_user", "test@user.com", "password")
        user = User.query.filter_by(email="test@user.com").first()
        user.active = False
        db.session.commit()
        with self.client:
            response_login = self.client.post(
                "/auth/login",
                data=json.dumps({
                    "email": "test@user.com",
                    "password": "password"
                }),
                content_type="application/json"
            )
            token = json.loads(response_login.data.decode())["auth_token"]
            response = self.client.get(
                "/auth/status",
                headers={"Authorization": f"Bearer {token}"}
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data["status"] == "fail")
            self.assertTrue(data["message"] == "Provide a valid auth token.")
            self.assertEqual(response.status_code, 401)

if __name__ == "__main__":
    unittest.main()
