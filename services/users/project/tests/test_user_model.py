import unittest

from project import db
from project.api.models import User
from project.api.utils import is_admin
from project.tests.base import BaseTestCase
from project.tests.utils import add_user
from sqlalchemy.exc import IntegrityError

class TestUserModel(BaseTestCase):
    
    def test_add_user(self):
        """Ensures user can be added to the database."""
        user = add_user("test_user", "test@user.com", "password")
        self.assertTrue(user.id)
        self.assertEqual(user.username, "test_user")
        self.assertEqual(user.email, "test@user.com")
        self.assertTrue(user.active)
        self.assertTrue(user.password)
        self.assertFalse(user.admin)
        self.assertFalse(is_admin(user.id))

    def test_add_user_duplicate_username(self):
        """Ensure error is thrown for duplicate usernames."""
        add_user("test_user", "test@user.com", "password1")
        duplicate_username = User(
            username="test_user",
            email="test2@user.com",
            password="password2"
        )
        db.session.add(duplicate_username)
        self.assertRaises(IntegrityError, db.session.commit)
        
    def test_add_user_duplicate_email(self):
        """Ensure error is thrown of duplicate emails."""
        add_user("test_user", "test@user.com", "password1")
        duplicate_email = User(
            username="test_user2",
            email="test@user.com",
            password="password2"
        )
        db.session.add(duplicate_email)
        self.assertRaises(IntegrityError, db.session.commit)
        
    def test_to_json(self):
        """Ensure User model renders JSON object as dict type."""
        user = add_user("test_user", "test@user.com", "password")
        self.assertTrue(isinstance(user.to_json(), dict))
        
    def test_passwords_are_random(self):
        """Ensure user passwords are random."""
        user_one = add_user("test_user1", "test1@user.com", "password1")
        user_two = add_user("test_user2", "test2@user.com", "password2")
        self.assertNotEqual(user_one.password, user_two.password)
    
    def test_encode_auth_token(self):
        """Ensures auth token is encoded in bytes."""
        user = add_user("test_user", "test@user.com", "password")
        auth_token = user.encode_auth_token(user.id)
        self.assertTrue(isinstance(auth_token, bytes))
        
    def test_decode_auth_token(self):
        user = add_user("test_user", "test@user.com", "password")
        auth_token = user.encode_auth_token(user.id)
        self.assertTrue(isinstance(auth_token, bytes))
        self.assertEqual(User.decode_auth_token(auth_token), user.id)

if __name__ == "__main__":
    unittest.main()
