# routes/donations.py
from flask import Blueprint, request, jsonify
from models import db, Donation
from datetime import datetime

donations_bp = Blueprint('donations', __name__, url_prefix='/api/donations')

@donations_bp.route('', methods=['GET'])
def get_donations():
    """
    Retrieve all donations ordered by donation time (most recent first).
    """
    donations = Donation.query.order_by(Donation.donated_at.desc()).all()
    donation_list = [{
        "id": d.id,
        "donor_name": d.donor_name,
        "donor_email": d.donor_email,
        "amount": d.amount,
        "message": d.message,
        "donated_at": d.donated_at.isoformat()
    } for d in donations]
    return jsonify(donation_list), 200

@donations_bp.route('', methods=['POST'])
def create_donation():
    """
    Create a new donation record.
    Expects JSON data with at least:
      - donor_name: string
      - amount: number
    Optionally:
      - donor_email: string
      - message: string
    """
    data = request.get_json()
    if not data or not data.get('donor_name') or not data.get('amount'):
        return jsonify({"error": "Donor name and amount are required"}), 400

    donation = Donation(
        donor_name=data.get('donor_name'),
        donor_email=data.get('donor_email'),
        amount=float(data.get('amount')),
        message=data.get('message'),
        donated_at=datetime.utcnow()
    )
    db.session.add(donation)
    db.session.commit()
    return jsonify({"message": "Donation recorded", "id": donation.id}), 201

@donations_bp.route('/<int:donation_id>', methods=['DELETE'])
def delete_donation(donation_id):
    """
    Delete a donation by its ID.
    """
    donation = Donation.query.get(donation_id)
    if not donation:
        return jsonify({"error": "Donation not found"}), 404
    db.session.delete(donation)
    db.session.commit()
    return jsonify({"message": "Donation deleted"}), 200
