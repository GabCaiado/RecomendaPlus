import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'recomenda-conteudo-secret-key-super-segura')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'recomenda-conteudo-jwt-secret-key-top-secret')
    
    # SQLite Database setup
    BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    db_env = os.environ.get('DATABASE_URL', '')
    if not db_env or db_env == 'sqlite:///recomenda.db':
        SQLALCHEMY_DATABASE_URI = f'sqlite:///{os.path.join(BASE_DIR, "recomenda.db")}'
    else:
        SQLALCHEMY_DATABASE_URI = db_env
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT expiration times
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=2)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
