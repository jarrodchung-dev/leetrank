from project import db

class Exercise(db.Model):
    """Exercise model for the Exercises service."""

    __tablename__ = "exercises"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    body = db.Column(db.String, nullable=False)
    test_code = db.Column(db.String, nullable=False)
    test_solution = db.Column(db.String, nullable=False)

    def __init__(self, body, test_code, test_solution):
        self.body = body
        self.test_code = test_code
        self.test_solution = test_solution

    def to_json(self):
        return {
            "id": self.id,
            "body": self.body,
            "test_code": self.test_code,
            "test_solution": self.test_solution
        }
