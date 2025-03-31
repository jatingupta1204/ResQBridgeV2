from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(256), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(64), nullable=False, default='admin')  # Only admin users allowed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<User {self.email}>'

class Incident(db.Model):
    __tablename__ = 'incidents'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(256), nullable=False)
    description = db.Column(db.Text, nullable=True)
    location = db.Column(db.String(256), nullable=False)  # e.g., "lat,lng" or address string
    contact = db.Column(db.String(64), nullable=True)      # New field for contact number
    status = db.Column(db.String(64), nullable=False, default="Pending")  # Pending, In Progress, Resolved
    reported_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    def __repr__(self):
        return f'<Incident {self.title}>'

class SOSReport(db.Model):
    __tablename__ = 'sos_reports'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(256), nullable=False)  # e.g., "SOS: Fire near Central Park"
    severity = db.Column(db.Text, nullable=True)
    location = db.Column(db.String(256), nullable=False)  # e.g., "lat,lng"
    status = db.Column(db.String(64), nullable=False, default="Pending")
    reported_at = db.Column(db.DateTime, default=datetime.utcnow)
    audio_url = db.Column(db.String(256), nullable=True)
    image_url = db.Column(db.String(256), nullable=True)
    video_url = db.Column(db.String(256), nullable=True)

    def __repr__(self):
        return f'<SOSReport {self.title}>'

class Donation(db.Model):
    __tablename__ = 'donations'
    id = db.Column(db.Integer, primary_key=True)
    donor_name = db.Column(db.String(128), nullable=False)
    donor_email = db.Column(db.String(256), nullable=True)
    amount = db.Column(db.Float, nullable=False)
    message = db.Column(db.Text, nullable=True)
    donated_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Donation {self.donor_name}: ${self.amount}>'

class Setting(db.Model):
    __tablename__ = 'settings'
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(128), unique=True, nullable=False)
    value = db.Column(db.String(256), nullable=False)

    def __repr__(self):
        return f'<Setting {self.key}: {self.value}>'
