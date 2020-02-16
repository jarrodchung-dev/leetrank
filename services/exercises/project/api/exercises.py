from flask import Blueprint
from flask import jsonify
from flask import request
from flask_restful import Api
from flask_restful import Resource
from project import db
from project.api.models import Exercise
from project.api.utils import authenticate_restful
from sqlalchemy import exc

exercises_blueprint = Blueprint("exercises", __name__)

api = Api(exercises_blueprint)

@exercises_blueprint.route("/exercises/ping", methods=["GET"])
def ping_pong():
    return jsonify({
        "status": "success",
        "message": "pong!"
    })

class ExerciseList(Resource):

    method_decorators = {"post": [authenticate_restful]}

    def get(self):
        """Get all exercises."""
        response_object = {
            "status": "success",
            "data": {
                "exercises": [
                    exercise.to_json() for exercise in Exercise.query.all()
                ]
            }
        }
        return response_object, 200
        
    def post(self, resp):
        """Adds exercises"""
        if not resp["admin"]:
            response_object = {
                "status": "error",
                "message": "You do not have permission to do that."
            }
            return response_object, 401
        post_data = request.get_json()
        if not post_data:
            response_object = {
                "status": "fail",
                "message": "Invalid payload."
            }
            return response_object, 400
        body = post_data.get("body")
        test_code = post_data.get("test_code")
        test_solution = post_data.get("test_solution")
        try:
            db.session.add(
                Exercise(
                    body=body,
                    test_code=test_code,
                    test_solution=test_solution
                )
            )
            db.session.commit()
            response_object = {
                "status": "success",
                "message": "New exercise was added."
            }
            return response_object, 201
        except (exc.IntegrityError, ValueError):
            db.session().rollback()
            response_object = {
                "status": "fail",
                "message": "Invalid payload."
            }
            return response_object, 400


api.add_resource(ExerciseList, "/exercises")
