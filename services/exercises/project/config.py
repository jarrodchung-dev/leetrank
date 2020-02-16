import os


class BaseConfig(object):
    """Base configurations"""
    DEBUG = False
    TESTING = False
    DEBUG_TB_ENABLED = False
    DEBUG_TB_INTERCEPT_REDIRECTS = False
    SECRET_KEY = os.environ.get("SECRET_KEY")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    

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
    TESTING = False
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
    

class ProductionConfig(BaseConfig):
    """Production configurations"""
    TESTING = False
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
