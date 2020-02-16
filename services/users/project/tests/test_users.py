import json
import unittest

from project import db
from project.api.models import User
from project.tests.base import BaseTestCase
from project.tests.utils import add_user


class TestUserService(BaseTestCase):
    """Tests for the Users Service."""

    def test_users_ping_route(self):
        """Pings the /users/ping route and tests the expected response."""
        response = self.client.get("/users/ping")
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 200)
        self.assertIn("Great success!", data["message"])
        self.assertIn("success", data["status"])
        
    def test_add_user(self):
        """Ensures new users can be added to the database."""
        add_user("test_user", "test@user.com", "password")
        user = User.query.filter_by(email="test@user.com").first()
        user.admin = True
        db.session.commit()
        with self.client:
            resp_login = self.client.post(
                "/auth/login",
                data=json.dumps({
                    "email": "test@user.com",
                    "password": "password"
                }),
                content_type="application/json"
            )
            token = json.loads(resp_login.data.decode())["auth_token"]
            response = self.client.post(
                "/users",
                data=json.dumps({
                    "username": "someone",
                    "email": "some@one.com",
                    "password": "some_password"
                }),
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 201)
            self.assertIn("some@one.com was added!", data["message"])
            self.assertIn("success", data["status"])
            
    def test_add_user_invalid_json(self):
        """Ensure error is thrown if the JSON object is invalid/empty."""
        add_user("test_user", "test@user.com", "password")
        user = User.query.filter_by(email="test@user.com").first()
        user.admin = True
        db.session.commit()
        with self.client:
            resp_login = self.client.post(
                "/auth/login",
                data=json.dumps({
                    "email": "test@user.com",
                    "password": "password"
                }),
                content_type="application/json"
            )
            token = json.loads(resp_login.data.decode())["auth_token"]
            response = self.client.post(
                "/users",
                data=json.dumps({
                    "email": "some@one.com",
                    "password": "some_password"
                }),
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn("Invalid payload.", data["message"])
            self.assertIn("fail", data["status"])
    
    def test_add_user_invalid_json_keys(self):
        """
        Ensure error is thrown if the JSON object does not have a username key.
        """
        add_user("test_user", "test@user.com", "password")
        user = User.query.filter_by(email="test@user.com").first()
        user.admin = True
        db.session.commit()
        with self.client:
            resp_login = self.client.post(
                "/auth/login",
                data=json.dumps({
                    "email": "test@user.com",
                    "password": "password"
                }),
                content_type="application/json"
            )
            token = json.loads(resp_login.data.decode())["auth_token"]
            response = self.client.post(
                "/users",
                data=json.dumps({
                    "email": "some@one.com",
                    "password": "password"
                }),
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn("Invalid payload.", data["message"])
            self.assertIn("fail", data["status"])
    
    def test_add_user_duplicate_email(self):
        """Ensure error is thrown if the email already exists."""
        add_user("test_user", "test@user.com", "password")
        user = User.query.filter_by(email="test@user.com").first()
        user.admin = True
        db.session.commit()
        with self.client:
            resp_login = self.client.post(
                "/auth/login",
                data=json.dumps({
                    "email": "test@user.com",
                    "password": "password"
                }),
                content_type="application/json"
            )
            token1 = json.loads(resp_login.data.decode())["auth_token"]
            self.client.post(
                "/users",
                data=json.dumps({
                    "username": "someone",
                    "email": "some@one.com",
                    "password": "some_password"
                }),
                content_type="application/json",
                headers={"Authorization": f"Bearer {token1}"}
            )
            token2 = json.loads(resp_login.data.decode())["auth_token"]
            response = self.client.post(
                "/users",
                data=json.dumps({
                    "username": "anyone",
                    "email": "some@one.com",
                    "password": "any_password"
                }),
                content_type="application/json",
                headers={"Authorization": f"Bearer {token2}"}
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn("Sorry. That email already exists.", data["message"])
            self.assertIn("fail", data["status"])
            
    def test_get_single_user(self):
        """Ensure get single user behaves correctly."""
        user = add_user("test_user", "test@user.com", "password")
        db.session.add(user)
        db.session.commit()
        with self.client:
            response = self.client.get(f"/users/{user.id}")
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 200)
            self.assertIn("test_user", data["data"]["username"])
            self.assertIn("test@user.com", data["data"]["email"])
            self.assertIn("success", data["status"])
    
    def test_single_user_no_id(self):
        """Ensure error is thrown if user ID is not provided."""
        with self.client:
            response = self.client.get("/users/catdog")
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 404)
            self.assertIn("User does not exist.", data["message"])
            self.assertIn("fail", data["status"])
    
    def test_single_user_incorrect_id(self):
        """Ensure error is thrown if the id does not exist."""
        with self.client:
            response = self.client.get("/users/999")
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 404)
            self.assertIn("User does not exist.", data["message"])
            self.assertIn("fail", data["status"])
    
    def test_all_users(self):
        """Ensure GET all users behaves correctly."""
        add_user("test_user1", "test1@user.com", "password1")
        add_user("test_user2", "test2@user.com", "password2")
        with self.client:
            response = self.client.get("/users")
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(data["data"]["users"]), 2)
            self.assertIn("test_user1", data["data"]["users"][0]["username"])
            self.assertIn("test1@user.com", data["data"]["users"][0]["email"])
            self.assertTrue(data["data"]["users"][0]["active"])
            self.assertFalse(data["data"]["users"][0]["admin"])
            self.assertIn("test_user2", data["data"]["users"][1]["username"])
            self.assertIn("test2@user.com", data["data"]["users"][1]["email"])
            self.assertTrue(data["data"]["users"][1]["active"])
            self.assertFalse(data["data"]["users"][1]["admin"])
            self.assertIn("success", data["status"])
            
    def test_main_route_no_users(self):
        """
        Ensure the main route behaves correctly when no users have been added 
        to the database.
        """
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"All Users", response.data)
        self.assertIn(b"<p>No users!</p>", response.data)
        
    def test_main_route_with_users(self):
        """
        Ensure the main route behaves correctly when users have been added to 
        the database.
        """
        add_user("test_user1", "test1@user.com", "password1")
        add_user("test_user2", "test2@user.com", "password2")
        with self.client:
            response = self.client.get("/")
            self.assertEqual(response.status_code, 200)
            self.assertIn(b"All Users", response.data)
            self.assertNotIn(b"<p>No users!</p>", response.data)
            self.assertIn(b"test_user1", response.data)
            self.assertIn(b"test_user2", response.data)
    
    def test_main_route_add_user(self):
        """
        Ensure a new user can be added to the database via POST request.
        """
        with self.client:
            response = self.client.post(
                "/",
                data={
                    "username": "test_user3",
                    "email": "test3@user.com",
                    "password": "password3",
                },
                follow_redirects=True
            )
            self.assertEqual(response.status_code, 200)
            self.assertIn(b"All Users", response.data)
            self.assertNotIn(b"<p>No users!</p>", response.data)
            self.assertIn(b"test_user3", response.data)
            
    def test_add_user_invalid_json_keys_no_password(self):
        """
        Ensure error is thrown if the JSON object does not contain a password.
        """
        add_user("test_user", "test@user.com", "password")
        user = User.query.filter_by(email="test@user.com").first()
        user.admin = True
        db.session.commit()
        with self.client:
            resp_login = self.client.post(
                "/auth/login",
                data=json.dumps({
                    "email": "test@user.com",
                    "password": "password"
                }),
                content_type="application/json",
            )
            token = json.loads(resp_login.data.decode())["auth_token"]
            response = self.client.post(
                "/users",
                data=json.dumps({
                    "username": "someone",
                    "email": "some@one.com"
                }),
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn("Invalid payload.", data["message"])
            self.assertIn("fail", data["status"])
            
    def test_add_user_inactive(self):
        """
        Ensure error is thrown if user is added with an invalid auth token.
        """
        add_user("test_user", "test@user.com", "password")
        user = User.query.filter_by(email="test@user.com").first()
        user.active = False
        db.session.commit()
        with self.client:
            resp_login = self.client.post(
                "/auth/login",
                data=json.dumps({
                    "email": "test@user.com",
                    "password": "password"
                }),
                content_type="application/json"
            )
            token = json.loads(resp_login.data.decode())["auth_token"]
            response = self.client.post(
                "/users",
                data=json.dumps({
                    "username": "someone",
                    "email": "some@one.com",
                    "password": "some_password"
                }),
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data["status"] == "fail")
            self.assertTrue(data["message"] == "Provide a valid auth token.")
            self.assertEqual(response.status_code, 401)
            
    def test_add_user_not_admin(self):
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
            response = self.client.post(
                "/users",
                data=json.dumps({
                    "username": "someone",
                    "email": "some@one.com",
                    "password": "some_password"
                }),
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data["status"] == "fail")
            self.assertTrue(
                data["message"] == "You do not have permission to do that."
            )
            self.assertEqual(response.status_code, 401)

if __name__ == "__main__":
    unittest.main()
