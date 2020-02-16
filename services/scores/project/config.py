import os

class BaseConfig:
    """Base configurations"""
    DEBUG = False
    TESTING = False
    DEBUG_TB_ENABLED = False
    DEBUG_TB_INTERCEPT_REDIRECTS = False
    SECRET_KEY = os.environ.get("SECRET_KEY")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    USERS_SERVICE_URL = os.environ.get("USERS_SERVICE_URL")

class DevelopmentConfig(BaseConfig):
    """Development configurations"""
    DEBUG_TB_ENABLED = True
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")

class TestingConfig(BaseConfig):
    """Testing configurations"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_TEST_URL")

class StagingConfig(BaseConfig):
    """Staging configurations"""
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")

class ProductionConfig(BaseConfig):
    """Production configurations"""
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")