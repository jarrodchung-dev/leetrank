import sys
import unittest
import werkzeug

from coverage import Coverage
from flask.cli import FlaskGroup
from project import create_app
from project import db
from project.api.models import Exercise

# This fixes testing import errors
werkzeug.cached_property = werkzeug.utils.cached_property

Cover = Coverage(
    branch=True,
    include="project/*",
    omit=[
        "project/tests*", 
        "project/config.py"
    ]
)
Cover.start()

app = create_app()
cli = FlaskGroup(create_app=create_app)

@cli.command()
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
    
@cli.command("recreate-db")
def recreate_db():
    db.drop_all()
    db.create_all()
    db.session.commit()
    print("Finished recreating the Exercises database.")

@cli.command("seed-db")
def seed_db():
    """Seeds the database."""
    db.session.add(
        Exercise(
            body=(
                "Define a function called sum that takes two integers as "
                "arguments and returns their sum."
            ),
            test_code="sum(2, 3)",
            test_solution="5"
        )
    )
    db.session.add(
        Exercise(
            body=(
                "Define a function called reverse that takes a string as "
                "an argument and returns the string in reverse order."
            ),
            test_code="reverse('racecar')",
            test_solution="racecar"
        )
    )
    db.session.add(
        Exercise(
            body=(
                "Define a function called factorial that takes a random "
                "number as an argument and then returns the factorial of "
                "that given number."
            ),
            test_code="factorial(5)",
            test_solution="120"
        )
    )
    db.session.commit()
    print("Finished seeding the Exercises database.")


if __name__ == "__main__":
    cli() 
