import os

from flask import Flask
from flask_cors import CORS
from flask_debugtoolbar import DebugToolbarExtension
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate()
toolbar = DebugToolbarExtension()
cors = CORS()

def create_app(script_info=None):
    
    app = Flask(__name__)
    
    CORS(app)
    
    app_settings = os.getenv("APP_SETTINGS")
    app.config.from_object(app_settings)
    
    toolbar.init_app(app)
    cors.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)
    
    from project.api.base import base_blueprint
    app.register_blueprint(base_blueprint)
    
    from project.api.scores import scores_blueprint
    app.register_blueprint(scores_blueprint)
    
    @app.shell_context_processor
    def ctx():
        return {
            "app": app,
            "db": db
        }
        
    return app