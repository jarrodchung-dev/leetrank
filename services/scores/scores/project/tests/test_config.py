import unittest

from flask import current_app
from flask_testing import TestCase
from project import create_app

app = create_app()

class TestDevelopmentConfig(TestCase):
    """Ensures app is using development configurations."""
    
    def create_app(self):
        app.config.from_object("project.config.DevelopmentConfig")
    
    def test_app_is_development(self):
        self.assertFalse(current_app is None)
        
class TestTestingConfig(TestCase):
    """Ensures app is using testing configurations."""
    
    def create_app(self):
        app.config.from_object("project.config.TestingConfig")
        return app
    
    def test_app_is_testing(self):
        self.assertTrue(app.config["TESTING"])

class TestProductionConfig(TestCase):
    """Ensures app is using production configurations."""
    
    def create_app(self):
        app.config.from_object("project.config.ProductionConfig")
        return app
        
    def test_app_is_testing(self):
        self.assertFalse(app.confi["TESTING"])


if __name__ == "__main__":
    unittest.main()