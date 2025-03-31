import os
import re
import json
import wave
import logging
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from vosk import Model as VoskModel, KaldiRecognizer
from transformers import pipeline
from pydub import AudioSegment

# Configure logging for debugging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

nlp_bp = Blueprint("nlp_bp", __name__)

# Set up the uploads folder (relative to this file)
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "..", "uploads")
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Determine the model path.
model_path = os.environ.get("VOSK_MODEL_PATH", os.path.join(os.path.dirname(__file__), "..", "vosk-model-small-en-us-0.15"))
if not os.path.exists(model_path):
    raise FileNotFoundError(
        f"Model folder not found at {model_path}. Download a Vosk model and place it at this location, "
        "or set VOSK_MODEL_PATH to an absolute path."
    )

# Try to load the Vosk model
try:
    vosk_model = VoskModel(model_path)
except Exception as e:
    raise Exception(f"Failed to create a Vosk model from {model_path}: {e}")

# Create a Hugging Face NER pipeline with grouped entities, explicitly using CPU.
ner_pipeline = pipeline("ner", grouped_entities=True, device=-1)

def convert_to_wav(audio_path: str) -> str:
    """
    Convert the provided audio file to WAV format using pydub.
    """
    wav_path = audio_path.rsplit(".", 1)[0] + ".wav"
    audio = AudioSegment.from_file(audio_path)
    audio.export(wav_path, format="wav")
    return wav_path

def transcribe_audio(audio_path: str) -> str:
    """
    Transcribe the given audio file using Vosk.
    Converts the file to WAV format if needed.
    """
    # Convert to WAV format
    wav_path = convert_to_wav(audio_path)
    logger.info(f"Converted audio to WAV: {wav_path}")
    
    try:
        wf = wave.open(wav_path, "rb")
    except Exception as e:
        logger.error("Error opening WAV file: %s", e)
        os.remove(wav_path)
        raise

    rec = KaldiRecognizer(vosk_model, wf.getframerate())
    results = []

    while True:
        data = wf.readframes(4000)
        if len(data) == 0:
            break
        if rec.AcceptWaveform(data):
            res = rec.Result()
            if res.strip():
                try:
                    json_res = json.loads(res)
                    text_piece = json_res.get("text", "")
                    if text_piece:
                        results.append(text_piece)
                    else:
                        logger.debug("Complete result had no text: %s", res)
                except json.JSONDecodeError as e:
                    logger.error("JSONDecodeError for complete result: %s; Error: %s", res, e)
                    continue

    final_res = rec.FinalResult()
    logger.info("Final result: %s", final_res)
    if final_res.strip():
        try:
            json_final = json.loads(final_res)
            final_text = json_final.get("text", "")
            if final_text:
                results.append(final_text)
            else:
                logger.debug("Final result had no text: %s", final_res)
        except json.JSONDecodeError as e:
            logger.error("JSONDecodeError for final result: %s; Error: %s", final_res, e)

    wf.close()
    os.remove(wav_path)
    
    full_text = " ".join(results).strip()
    logger.info("Full transcription: %s", full_text)
    return full_text

def extract_details(text: str) -> dict:
    """
    Extract location, emergency type, and severity from the transcribed text
    using a Hugging Face Transformers NER pipeline and simple keyword matching.
    """
    ner_results = ner_pipeline(text)
    locations = [
        entity["word"]
        for entity in ner_results
        if entity["entity_group"] in ["LOC", "GPE"]
    ]
    
    emergency_keywords = ["accident", "fire", "injury", "heart attack", "crash", "earthquake", "flood"]
    severity_keywords = {"minor": "low", "serious": "medium", "critical": "high", "severe": "high"}
    
    emergency_type = None
    severity = "Unknown"
    text_lower = text.lower()
    
    for keyword in emergency_keywords:
        if keyword in text_lower:
            emergency_type = keyword
            break

    for key, level in severity_keywords.items():
        if key in text_lower:
            severity = level
            break

    if not locations:
        location_match = re.search(r"(?:in|at) ([A-Z][a-z]+(?: [A-Z][a-z]+)*)", text)
        if location_match:
            locations.append(location_match.group(1))
    
    return {
        "location": locations if locations else "Not mentioned",
        "emergency_type": emergency_type if emergency_type else "Not specified",
        "severity": severity
    }

@nlp_bp.route("/nlp", methods=["POST"])
def analyze():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files["audio"]
    if audio_file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(audio_file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    audio_file.save(file_path)
    logger.info(f"Saved audio file to: {file_path}")

    try:
        text = transcribe_audio(file_path)
        details = extract_details(text)
        
        # Ensure file cleanup
        if os.path.exists(file_path):
            os.remove(file_path)
        
        response = {"transcription": text, "details": details}
        logger.info(f"Response: {response}")
        return jsonify(response), 200
    
    except Exception as e:
        logger.error(f"Error analyzing audio: {e}")
        
        # Ensure file cleanup
        if os.path.exists(file_path):
            os.remove(file_path)

        return jsonify({"error": "Internal server error", "details": str(e)}), 500

