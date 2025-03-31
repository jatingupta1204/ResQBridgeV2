import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key_here")
    SQLALCHEMY_DATABASE_URI = "sqlite:///database.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = "your_jwt_secret_key_here"  # Required for JWT Authentication
    UPLOAD_FOLDER = "uploads"