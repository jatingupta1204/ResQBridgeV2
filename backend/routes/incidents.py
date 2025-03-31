# routes/incidents.py
from flask import Blueprint, request, jsonify
from models import db, Incident
from datetime import datetime

incidents_bp = Blueprint('incidents', __name__, url_prefix='/api/incidents')

@incidents_bp.route('', methods=['GET'])
def get_incidents():
    """
    Retrieve all incidents ordered by reported_at (most recent first).
    """
    try:
        incidents = Incident.query.order_by(Incident.reported_at.desc()).all()
        data = [{
            'id': inc.id,
            'title': inc.title,
            'description': inc.description,
            'location': inc.location,
            'contact': inc.contact,  # Include contact number in the response
            'reportedAt': inc.reported_at.isoformat(),
            'status': inc.status
        } for inc in incidents]
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@incidents_bp.route('', methods=['POST'])
def create_incident():
    """
    Create a new incident. Required fields: title and location.
    Optional fields: description, status, reportedAt, contact.
    """
    data = request.get_json() or request.form.to_dict()
    
    # Validate required fields.
    title = data.get('title')
    location = data.get('location')
    if not title or not location:
        return jsonify({'error': 'Title and location are required'}), 400
    
    # Parse reportedAt if provided; otherwise, use current time.
    reported_at_str = data.get('reportedAt')
    if reported_at_str:
        try:
            reported_at = datetime.fromisoformat(reported_at_str)
        except Exception:
            reported_at = datetime.utcnow()
    else:
        reported_at = datetime.utcnow()
    
    # Create a new Incident instance including the contact field.
    inc = Incident(
        title=title,
        description=data.get('description'),
        location=location,
        contact=data.get('contact'),  # Save the contact number
        reported_at=reported_at,
        status=data.get('status') or 'Pending'
    )
    
    try:
        db.session.add(inc)
        db.session.commit()
        return jsonify({'message': 'Incident created', 'id': inc.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@incidents_bp.route('/<int:id>', methods=['DELETE'])
def delete_incident(id):
    """
    Delete an incident by its ID.
    """
    inc = Incident.query.get(id)
    if not inc:
        return jsonify({'error': 'Incident not found'}), 404
    try:
        db.session.delete(inc)
        db.session.commit()
        return jsonify({'message': 'Incident deleted'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@incidents_bp.route("/<int:id>", methods=["PUT"])
def update_incident(id):
    """
    Update an incident by its ID.
    """
    incident = Incident.query.get(id)
    if not incident:
        return jsonify({"error": "Incident not found"}), 404

    data = request.json
    incident.status = data.get("status", incident.status)
    incident.description = data.get("description", incident.description)

    try:
        db.session.commit()
        return jsonify({"message": "Incident updated successfully", "incident": {
            "id": incident.id,
            "status": incident.status,
            "description": incident.description,
        }}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
