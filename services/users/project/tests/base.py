from flask_testing import TestCase
from project import create_app
from project import db

app = create_app()

class BaseTestCase(TestCase):
    """Base class for User Services tests."""
    
    def create_app(self):
        """Creates the application for with testing configurations."""
        app.config.from_object("project.config.TestingConfig")
        return app
        
    def setUp(self):
        """Creates the database with testing configurations."""
        db.create_all()
        db.session.commit()
        
    def tearDown(self):
        """Tears down the database after tests finish running."""
        db.session.remove()
        db.drop_all()
