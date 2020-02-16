from flask import Blueprint
from flask import jsonify
from project.api.utils import authenticate

base_blueprint = Blueprint("base", __name__)

@base_blueprint.route("/base/ping", methods=["GET"])
@authenticate
def ping_pong(resp):
    return jsonify({
        "status": "success",
        "message": "pong!"
    })
