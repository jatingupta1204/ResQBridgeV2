import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button"; // adjust path as needed
import { Input } from "@/components/ui/input";   // adjust path as needed

type AnalysisResult = {
  transcription: string;
  details: {
    location: string[] | string;
    emergency_type: string;
    severity: string;
  };
};

const AudioTranscription: React.FC = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const analyzeAudio = async (audioFile: File | Blob) => {
    const formData = new FormData();
    formData.append("audio", audioFile);

    try {
      const response = await fetch("/api/nlp", {
        method: "POST",
        body: formData,
      });
      const text = await response.text();
      if (!text || text.trim() === "") {
        throw new Error("Empty response from server");
      }
      let data: AnalysisResult;
      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("JSON parsing error:", error, "Raw response:", text);
        throw error;
      }
      setResult(data);
    } catch (error) {
      console.error("Error analyzing audio:", error);
      alert("Error analyzing audio. Check the console for details.");
    }
  };

  const handleFileUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (fileInputRef.current && fileInputRef.current.files?.length) {
      analyzeAudio(fileInputRef.current.files[0]);
    } else {
      alert("Please select an audio file.");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      const audioChunks: BlobPart[] = [];
      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: "audio/webm" });
        setRecordedBlob(blob);
      };
      recorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Unable to access microphone.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const handleRecordedSubmit = () => {
    if (recordedBlob) {
      analyzeAudio(recordedBlob);
    } else {
      alert("No recorded audio available.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Audio Transcription & Analysis</h1>
      
      {/* File Upload Section */}
      <div className="mb-8 border p-4 rounded shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Upload Audio</h2>
        <form onSubmit={handleFileUpload} className="flex flex-col gap-3">
          <Input type="file" accept="audio/*" ref={fileInputRef} className="border" />
          <Button type="submit" className="w-full">Upload & Analyze</Button>
        </form>
      </div>
      
      {/* Recording Section */}
      <div className="mb-8 border p-4 rounded shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Record Audio</h2>
        <div className="flex flex-col gap-3 items-center">
          {!recording ? (
            <Button onClick={startRecording} className="w-full">Start Recording</Button>
          ) : (
            <Button onClick={stopRecording} className="w-full bg-red-500 hover:bg-red-600">Stop Recording</Button>
          )}
          {recordedBlob && (
            <Button onClick={handleRecordedSubmit} className="w-full">
              Analyze Recorded Audio
            </Button>
          )}
        </div>
      </div>
      
      {/* Result Display */}
      <div className="border p-4 rounded shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Result</h2>
        {result ? (
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        ) : (
          <p className="text-gray-500">No result yet.</p>
        )}
      </div>
    </div>
  );
};

export default AudioTranscription;
