from flask import Blueprint, request, jsonify
import os
import cv2  # type: ignore
import numpy as np  # type: ignore
import base64
from ultralytics import YOLO  # type: ignore
import io

predict_bp = Blueprint("predict", __name__, url_prefix="/api/predict")

# Global model variable
model = None

def get_model():
    """Load and return the YOLO model"""
    global model
    if model is None:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        model_path = os.path.join(base_dir, "ResqBridgeAccidentDetection.onnx")
        if not os.path.exists(model_path):
            model_path = os.path.join(base_dir, "best.pt")  # Fallback model
        model = YOLO(model_path)
    return model

@predict_bp.route("", methods=["POST"])
def predict():
    try:
        # Retrieve image data from the request JSON
        data = request.get_json() or {}
        image_data = data.get("image")
        if not image_data:
            return jsonify({"error": "No image data provided"}), 400

        # Remove data URL header if present
        if "," in image_data:
            image_data = image_data.split(",")[1]
        
        # Decode base64 image data
        image_bytes = base64.b64decode(image_data)
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return jsonify({"error": "Invalid image data"}), 400

        # Process the image using YOLO model
        model_instance = get_model()
        results = model_instance(img, conf=0.25, save=False, verbose=False)

        # Extract the most relevant detection (with highest confidence)
        detection = None
        max_confidence = 0.0
        severity = "Low"  # Default severity level

        # Process the first result (assuming one image is passed)
        for result in results:
            if hasattr(result.boxes, "conf") and len(result.boxes.conf) > 0:
                confs = result.boxes.conf.tolist()
                coords = result.boxes.xyxy.tolist() if hasattr(result.boxes, "xyxy") else []
                classes = result.boxes.cls.tolist() if hasattr(result.boxes, "cls") else []
                names = [result.names[int(cls)] for cls in classes] if hasattr(result, "names") else []

                for i, conf in enumerate(confs):
                    if conf > max_confidence:
                        max_confidence = conf
                        detection = {
                            "class": names[i] if i < len(names) else "unknown",
                            "confidence": conf,
                            "coordinates": coords[i] if i < len(coords) else None,
                        }

                        # Determine severity based on confidence
                        if conf > 0.6:
                            severity = "Moderate"
                        if conf > 0.8:
                            severity = "High"
            break  # process only the first result

        # Get annotated image from results (using the first result)
        annotated_img = None
        for r in results:
            annotated_img = r.plot()  # returns image in RGB format with annotations
            break

        if annotated_img is None:
            annotated_img = img  # fallback if no annotations

        # Convert annotated image from RGB to BGR for encoding
        annotated_img = cv2.cvtColor(annotated_img, cv2.COLOR_RGB2BGR)
        success, buffer = cv2.imencode(".jpg", annotated_img)
        if not success:
            return jsonify({"error": "Failed to encode annotated image"}), 500
        result_base64 = base64.b64encode(buffer).decode("utf-8")

        response_data = {
            "success": True,
            "accidentDetected": bool(detection),
            "detection": {
                **(detection or {}),
                "severity": severity
            },
            "processedImage": f"data:image/jpeg;base64,{result_base64}"
        }
        return jsonify(response_data), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
