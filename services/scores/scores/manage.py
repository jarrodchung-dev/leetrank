import coverage
import os
import requests
import sys
import unittest

from flask.cli import FlaskGroup
from project import create_app
from project import db
from project.api.models import Score

COV = coverage.Coverage(
    branch=True,
    include="project/*",
    omit=[
        "project/tests/*",
        "project/config.py"
    ]
)
COV.start()

app = create_app()
cli = FlaskGroup(create_app=create_app)

@cli.command("test")
def test():
    """Runs the tests without code coverage."""
    tests = unittest.TestLoader().discover("project/tests", pattern="test*.py")
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        return 0
    sys.exit(result)

@cli.command("coverage")
def cov():
    """Runs unittests with coverage."""
    tests = unittest.TestLoader().discover("project/tests")
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        COV.stop()
        COV.save()
        print("Coverage Summary:")
        COV.report()
        COV.html_report()
        COV.erase()
        return
    sys.exit(result)
    
@cli.command("recreate-db")
def recreate_db():
    db.drop_all()
    db.session.commit()
    
@cli.command("seed-db")
def seed_db():
    """Seeds the database."""
    url = "{0}/exercises".format(os.environ.get("EXERCISES_SERIVCE_URL"))
    response = requests.get(url)
    exercises = response.json()["data"]["exercises"]
    url = "{0}/users".format(os.environ.get("USERS_SERVICE_URL"))
    response = requests.get(url)
    users = response.json()["data"]["users"]
    for user in users:
        for exercise in exercises:
            db.session.add(
                Score(
                    user_id=user["id"],
                    exercise_id=exercise["id"]      
                )
            )
    db.session.commit()
    
if __name__ == "__main__":
    cli()