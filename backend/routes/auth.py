# routes/auth.py
from flask import Blueprint, request, jsonify
from models import db, User

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('', methods=['POST'])
def auth():
    data = request.get_json()
    action = data.get('action')
    
    if action == 'register':
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        
        if not name or not email or not password:
            return jsonify({'error': 'Missing fields'}), 400
        
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Registration creates volunteer accounts by default.
        user = User(name=name, email=email, role="volunteer")
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    
    elif action == 'login':
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Missing fields'}), 400
        
        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            # Only allow login if the user is an admin.
            if user.role != "admin":
                return jsonify({'error': 'Access denied. Only admin can login.'}), 403
            return jsonify({
              'message': 'Login successful',
              'user': {'id': user.id, 'name': user.name, 'email': user.email}
            }), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
    else:
        return jsonify({'error': 'Invalid action'}), 400
