Project Overview: ResQ Bridge – AI-Powered Emergency Response System

Purpose & Functionality:
ResQ Bridge is an AI-driven emergency response system designed to detect and report accidents in real-time. By leveraging dashcam-based AI analysis and voice-based SOS detection, the system ensures faster emergency assistance and minimizes response delays.

Problem Solved:
Traditional emergency response systems rely on bystanders to report accidents, leading to delays—especially when victims are unconscious or in remote areas. ResQ Bridge automates accident detection and emergency reporting, eliminating this critical delay.

Key Features & Benefits:

AI-powered Dashcam Analysis: Uses YOLO-based computer vision to detect accidents in real-time.
Voice-based SOS Detection: Recognizes distress signals in audio and extracts details like location and emergency type using NLP.
Severity Analysis: AI classifies the accident's urgency to prioritize response.
Automated Emergency Alerts: Instantly notifies authorities, nearby hospitals, and family members.
By combining computer vision, NLP, and real-time alert systems, ResQ Bridge reduces emergency response time and enhances road safety.

Dependencies

To run the ResQ Bridge prototype, ensure you have the following software installed:

Programming Languages & Frameworks
Python 3.9+ – Core language for backend and AI models
Node.js 18+ – For the frontend (React-based)


Backend & AI Model Dependencies (Python)

Flask 2.2.5 – Backend framework (pip install flask==2.2.5)
Whisper 1.0 – OpenAI’s speech-to-text model (pip install openai-whisper)
YOLOv5 – Accident detection model (pip install ultralytics)
PyTorch 2.0+ – AI model support (pip install torch torchvision torchaudio)
spacy 3.5 – NLP processing (pip install spacy==3.5)
pandas 1.5.3 – Data handling (pip install pandas==1.5.3)


Frontend Dependencies (React.js)

React 18+ – UI framework

Tailwind CSS – Styling (npm install tailwindcss)
Axios – API requests (npm install axios)


Setup Instructions

1. Clone the Repository

git clone https://github.com/RG1208/ResQBridgeV2  
cd resq-bridge

2. Backend Setup

pip install -r requirements.txt
python app.py

3. Frontend Setup

Install Dependencies
cd client  
npm install
Start React App
npm start

Basic Usage

1. Upload a Video Feed – The YOLO model analyzes real-time footage for accident detection.
2. Voice-based SOS Activation – Whisper model transcribes distress calls and detects emergency details.
3. Real-time Alerts – The system sends notifications to hospitals and emergency services.

Team Members

Rachit –  Frontend & AI Model Development
Khushi Gaba – AI Model Development
Jatin - Backend & AI Model Integration


License

This project is licensed under MIT License.

Future Plans

1. Integration with IoT-based Smart Detection Devices

We plan to integrate ResQ Bridge with smart IoT devices capable of detecting high-impact accidents in real time. These devices will use accelerometers and gyroscopes to sense abrupt changes in velocity and impact forces, triggering an automatic emergency alert. This will reduce reliance on human intervention and ensure faster response times.

3. Multi-Language Voice Processing

Our speech-to-text model currently supports English, but we plan to expand it to regional languages like Hindi, Tamil, Bengali, and more. This will make the system more accessible in diverse linguistic regions, improving its usability in emergency scenarios.

4. Real-time Mapping & Predictive Analytics

We aim to integrate heatmap analysis and predictive analytics to identify accident-prone areas based on historical crash data. This feature will allow authorities and organizations to improve road safety by implementing preventive measures in high-risk zones.

5. Emergency Response Network Expansion

In the future, we plan to partner with hospitals, police departments, and NGOs to create a nationwide emergency response network. This will ensure that emergency alerts are instantly dispatched to the nearest responders, reducing response time and improving survival rates.

6. Integration with Smart Vehicles

We envision a system where ResQ Bridge can be integrated into smart cars and public transport systems. Using in-vehicle sensors and AI-driven crash detection, the system will automatically notify emergency services when a severe accident occurs, reducing human delays in reporting.

7. Blockchain-Based Data Security

To maintain data privacy and integrity, we plan to explore blockchain technology for secure storage of emergency data. This will prevent data tampering and ensure transparency in emergency reporting.

8. Mobile Application for Public Reporting

We aim to develop a ResQ Bridge mobile app where users can report accidents, request emergency assistance, and track response times. A crowdsourced emergency alert system will enhance the platform’s reach and effectiveness.

9. AI-based Medical Assistance Chatbot

An AI-powered chatbot will be integrated to guide users in providing first aid while waiting for emergency services. The chatbot will analyze the situation and give real-time medical instructions based on the injury type detected in the call or text input.
