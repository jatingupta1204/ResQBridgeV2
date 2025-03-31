from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from flask_migrate import Migrate
from routes.auth import auth_bp
from routes.incidents import incidents_bp
from routes.users import users_bp
from routes.predict import predict_bp
from routes.sos import sos_bp
from routes.donations import donations_bp
from routes.nlp import nlp_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for all routes matching /api/*
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Initialize the database and set up migrations
    db.init_app(app)
    migrate = Migrate(app, db)

    # Register blueprints with their URL prefixes
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(incidents_bp, url_prefix="/api/incidents")
    app.register_blueprint(users_bp, url_prefix="/api/users")
    app.register_blueprint(predict_bp, url_prefix="/api/predict")
    app.register_blueprint(sos_bp, url_prefix="/api/sos")
    app.register_blueprint(donations_bp, url_prefix="/api/donations")
    app.register_blueprint(nlp_bp, url_prefix="/api")


    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
