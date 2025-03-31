from flask import Blueprint, request, jsonify
from models import db, SOSReport
from datetime import datetime
import cloudinary
import cloudinary.uploader

sos_bp = Blueprint("sos", __name__, url_prefix="/api/sos")

# 🔹 Configure Cloudinary (replace with your credentials)
cloudinary.config(
    cloud_name="edutrack",
    api_key="631736547714574",
    api_secret="J-7JEjr7_6FmlzInuv7K2_VUekY",
    secure=True
)

def upload_to_cloudinary(file, folder):
    """Uploads a file to Cloudinary and returns its secure URL."""
    if file:
        # Determine resource_type based on the file's content type
        if file.content_type.startswith('audio/'):
            resource_type = "auto"  # or specifically "raw" or "video" for audio
        elif file.content_type.startswith('video/'):
            resource_type = "video"
        else:
            resource_type = "image"
            
        response = cloudinary.uploader.upload(
            file, 
            folder=folder,
            resource_type=resource_type
        )
        return response["secure_url"]  # Get the uploaded file's URL
    return None


@sos_bp.route("/", methods=["GET"])
def get_sos_reports():
    """
    Retrieve all SOS reports ordered by reported time (most recent first).
    """
    sos_reports = SOSReport.query.order_by(SOSReport.reported_at.desc()).all()
    data = [
        {
            "id": report.id,
            "title": report.title,
            "severity": report.severity,
            "location": report.location,
            "status": report.status,
            "reported_at": report.reported_at.isoformat(),
            "image_url": report.image_url,
            "video_url": report.video_url,
            "audio_url": report.audio_url,
        }
        for report in sos_reports
    ]
    return jsonify(data), 200

@sos_bp.route("/", methods=["POST"])
def send_sos():
    """
    Create a new SOS alert with optional media uploads (image, video, audio).
    """
    user_id = request.form.get("user_id")
    severity = request.form.get("severity")
    location = request.form.get("location")
    title = request.form.get("title", "SOS Alert")
    
    if not user_id or not severity or not location:
        return jsonify({"error": "user_id, severity, and location are required"}), 400
    
    # Handle file uploads
    image_url = None
    video_url = None
    audio_url = None
    
    try:
        if "image" in request.files and request.files["image"].filename:
            image_url = upload_to_cloudinary(request.files.get("image"), "sos_images")
            
        if "video" in request.files and request.files["video"].filename:
            video_url = upload_to_cloudinary(request.files.get("video"), "sos_videos")
            
        if "audio" in request.files and request.files["audio"].filename:
            audio_url = upload_to_cloudinary(request.files.get("audio"), "sos_audio")
    except Exception as e:
        return jsonify({"error": f"Media upload failed: {str(e)}"}), 500
    
    # Save to database
    new_sos = SOSReport(
        title=title,
        severity=severity,
        location=location,
        status="Pending",
        reported_at=datetime.utcnow(),
        image_url=image_url,
        video_url=video_url,
        audio_url=audio_url
    )
    
    if hasattr(new_sos, "user_id"):
        new_sos.user_id = user_id
        
    try:
        db.session.add(new_sos)
        db.session.commit()
        
        return jsonify({
            "message": "SOS alert sent!",
            "id": new_sos.id,
            "image_url": image_url,
            "video_url": video_url,
            "audio_url": audio_url
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500

@sos_bp.route("/<int:sos_id>/resolve", methods=["PUT"])
def resolve_sos(sos_id):
    """
    Update the status of an SOS report to "Resolved".
    """
    sos = SOSReport.query.get(sos_id)
    if not sos:
        return jsonify({"error": "SOS report not found"}), 404

    sos.status = "Resolved"
    db.session.commit()
    return jsonify({"message": "SOS report resolved successfully!"}), 200

@sos_bp.route("/<int:sos_id>", methods=["PUT"])
def update_sos(sos_id):
    """
    Update an existing SOS report.
    """
    sos = SOSReport.query.get(sos_id)
    if not sos:
        return jsonify({"error": "SOS report not found"}), 404

    data = request.json
    sos.title = data.get("title", sos.title)
    sos.severity = data.get("severity", sos.severity)
    sos.location = data.get("location", sos.location)
    sos.status = data.get("status", sos.status)
    sos.reported_at = datetime.fromisoformat(data.get("reported_at", sos.reported_at.isoformat()))

    try:
        db.session.commit()
        return jsonify({"message": "SOS report updated successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500

@sos_bp.route("/<int:sos_id>", methods=["DELETE"])
def delete_sos(sos_id):
    """
    Delete an existing SOS report.
    """
    sos = SOSReport.query.get(sos_id)
    if not sos:
        return jsonify({"error": "SOS report not found"}), 404

    try:
        db.session.delete(sos)
        db.session.commit()
        return jsonify({"message": "SOS report deleted successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500