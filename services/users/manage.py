import sys
import unittest
import werkzeug

from coverage import Coverage
from flask.cli import FlaskGroup
from project import create_app
from project import db
from project.api.models import User

# This fixes testing import errors
werkzeug.cached_property = werkzeug.utils.cached_property

app = create_app()

cli = FlaskGroup(create_app=create_app)

Cover = Coverage(
    branch=True,
    include="project/*",
    omit=[
        "project/tests*", 
        "project/config.py"
    ]
)
Cover.start()

@cli.command("recreate-db")
def recreate_db():
    db.drop_all()
    db.create_all()
    db.session.commit()
    print("Finished recreating the Users database.")
   
@cli.command("seed-db")
def seed_db():
    """Seeds the database."""
    db.session.add(
        User(
            username="jarrodchung", 
            email="jarrodchung@gmail.com",
            password="jc_password"
        )
    )
    db.session.add(
        User(
            username="jarrod.sw.chung", 
            email="jarrod.sw.chung@gmail.com",
            password="jswc_password"
        )
    )
    db.session.commit()
    print("Finished seeding the Users database.")

@cli.command("test")
def test():
    """Runs the tests without code coverage."""
    tests = unittest.TestLoader().discover("project/tests", pattern="test*.py")
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        return 0
    sys.exit(result)

@cli.command("coverage")
def cover():
    """Runs tests with coverage."""
    tests = unittest.TestLoader().discover("project/tests")
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        Cover.stop()
        Cover.save()
        print("Coverage Summary:")
        Cover.report()
        Cover.html_report()
        Cover.erase()
        return 0
    sys.exit(result)

if __name__ == "__main__":
    cli()
