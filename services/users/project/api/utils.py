from flask import jsonify
from flask import request
from functools import wraps
from project.api.models import User

def authenticate(f):
    @wraps(f)
    def wraps_authenticate(*args, **kwargs):
        response_object = {
            "status": "fail",
            "message": "Provide a valid auth token."
        }
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify(response_object), 403
        auth_token = auth_header.split(" ")[1]
        response = User.decode_auth_token(auth_token)
        if isinstance(response, str):
            response_object["message"] = response
            return jsonify(response_object), 401
        user = User.query.filter_by(id=response).first()
        if not user or not user.active:
            return jsonify(response_object), 401
        return f(response, *args, **kwargs)
    return wraps_authenticate


def authenticate_restful(f):
    @wraps(f)
    def wraps_authenticate_restful(*args, **kwargs):
        response_object = {
            "status": "fail",
            "message": "Provide a valid auth token."
        }
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return response_object, 403
        auth_token = auth_header.split(" ")[1]
        response = User.decode_auth_token(auth_token)
        if isinstance(response, str):
            response_object["message"] = response
            return response_object, 401
        user = User.query.filter_by(id=response).first()
        if not user or not user.active:
            return response_object, 401
        return f(response, *args, **kwargs)
    return wraps_authenticate_restful

    
def is_admin(user_id):
    user = User.query.filter_by(id=user_id).first()
    return user.admin