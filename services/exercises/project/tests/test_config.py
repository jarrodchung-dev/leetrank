import os
import unittest

from flask import current_app
from flask_testing import TestCase
from project import create_app


app = create_app()


class TestDevelopmentConfig(TestCase):
    """
    Tests that the application was created with the proper
    development configuration settings
    """
    def create_app(self):
        app.config.from_object("project.config.DevelopmentConfig")
        return app
        
    def test_app_is_development(self):
        self.assertTrue(app.config["SECRET_KEY"] == "nostalgia_ultra")
        self.assertFalse(current_app is None)
        self.assertEqual(
            app.config["SQLALCHEMY_DATABASE_URI"],
            os.environ.get("DATABASE_URL")
        )
        
        
class TestTestingConfig(TestCase):
    """Tests for testing configurations."""
    def create_app(self):
        app.config.from_object("project.config.TestingConfig")
        return app
        
    def test_app_is_testing(self):
        self.assertTrue(app.config["SECRET_KEY"] == "nostalgia_ultra")
        self.assertTrue(app.config["TESTING"])
        self.assertFalse(app.config["PRESERVE_CONTEXT_ON_EXCEPTION"])
        self.assertEqual(
            app.config["SQLALCHEMY_DATABASE_URI"],
            os.environ.get("DATABASE_TEST_URL")
        )
        

class TestStagingConfig(TestCase):
    """Tests for staging configurations."""
    def create_app(self):
        app.config.from_object("project.config.StagingConfig")
        return app
        
    def test_app_is_staging(self):
        self.assertFalse(app.config["TESTING"], True)
        self.assertEqual(
            app.config["SQLALCHEMY_DATABASE_URI"],
            os.environ.get("DATABASE_URL")
        )


class TestProductionConfig(TestCase):
    """Tests for production configurations."""
    def create_app(self):
        app.config.from_object("project.config.ProductionConfig")
        return app
        
    def test_app_is_production(self):
        self.assertTrue(app.config["SECRET_KEY"] == "nostalgia_ultra") 
        self.assertFalse(app.config["TESTING"])

if __name__ == "__main__":
    unittest.main()
