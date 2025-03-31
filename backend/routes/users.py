from flask import Blueprint, request, jsonify
from models import db, User

users_bp = Blueprint('users', __name__)

@users_bp.route('', methods=['GET'])
def get_users():
    users = User.query.all()
    data = [{
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'role': user.role
    } for user in users]
    return jsonify(data), 200

@users_bp.route('/<int:user_id>', methods=["PUT"])
def update_user(user_id):
    data = request.get_json()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.name = data.get("name", user.name)
    user.email = data.get("email", user.email)
    user.role = data.get("role", user.role)

    try:
        db.session.commit()
        return jsonify({"message": "User updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@users_bp.route('/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
@users_bp.route('', methods=['POST'])
def create_user():
    data = request.get_json()

    if not all(key in data for key in ["name", "email", "password", "role"]):
        return jsonify({"error": "Missing required fields"}), 400

    existing_user = User.query.filter_by(email=data["email"]).first()
    if existing_user:
        return jsonify({"error": "Email already in use"}), 400

    new_user = User(
        name=data["name"],
        email=data["email"],
        role=data["role"]
    )
    new_user.set_password(data["password"])

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User created successfully", "id": new_user.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
