"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Camera, Mic, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { analyzeImage } from "@/api";

// Helper: Convert a data URL to a Blob.
function dataURLtoBlob(dataurl: string): Blob {
  const arr = dataurl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) throw new Error("Invalid data URL");
  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export default function SOSPage() {
  // Geolocation states.
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Media states.
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Additional states.
  const [countdown, setCountdown] = useState<number>(10);
  const [autoSubmitTimer, setAutoSubmitTimer] = useState<NodeJS.Timeout | null>(null);
  const [description, setDescription] = useState<string>(
    "Emergency reported via SOS. Please respond immediately."
  );
  const [severity, setSeverity] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Prevent duplicate submissions.
  const [sosSent, setSosSent] = useState<boolean>(false);
  // Using a ref to immediately block duplicate submissions.
  const isSubmittingRef = useRef<boolean>(false);

  // Refs.
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // On mount: fetch geolocation and start audio recording.
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoading(false);
        },
        () => {
          setError("Unable to get your location. Please enable location services.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
    startAudioRecording();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      if (autoSubmitTimer) clearInterval(autoSubmitTimer);
    };
  }, []);

  // Update description when severity changes.
  useEffect(() => {
    if (severity) {
      setDescription(`Emergency reported via SOS. Severity: ${severity}. Please respond immediately.`);
      // If severity is detected and no SOS has been sent yet, start auto submission.
      if (!sosSent) {
        startAutoSubmitTimer();
      }
    }
  }, [severity]);

  // Automatically record audio for 10 seconds.
  const startAudioRecording = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = audioStream;
      const recorder = new MediaRecorder(audioStream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = []; // Clear previous chunks
  
      recorder.ondataavailable = (event) => {
        // Only add the chunk if it's non-empty and if we haven't stored any chunk yet.
        if (event.data.size > 0 && audioChunksRef.current.length === 0) {
          audioChunksRef.current.push(event.data);
        }
      };
  
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/mp3" });
        setAudioBlob(blob);
        audioStream.getTracks().forEach((track) => track.stop());
      };
  
      recorder.start(); // Start recording without a timeslice.
      setTimeout(() => {
        if (recorder.state !== "inactive") recorder.stop();
      }, 10000);
    } catch (err) {
      console.error("Audio recording error:", err);
      setError("Could not access microphone. Please check permissions.");
    }
  };
  

  // Camera functions.
  const startCamera = async () => {
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = videoStream;
        streamRef.current = videoStream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Could not access camera. Please check permissions.");
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setCapturedImage(dataUrl);
      if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());
      setCameraActive(false);
      
      // Analyze image for severity immediately after capture.
      analyzeImageForSeverity(dataUrl);
    }
  };

  const resetCamera = () => {
    setCapturedImage(null);
    setSeverity(null);
    if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());
    setCameraActive(false);
  };

  // Auto-submit timer: countdown from 10 seconds, then automatically submit SOS.
  const startAutoSubmitTimer = () => {
    setCountdown(10);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitSOS();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setAutoSubmitTimer(timer);
  };

  const cancelSOS = () => {
    if (autoSubmitTimer) {
      clearInterval(autoSubmitTimer);
      setAutoSubmitTimer(null);
      setCountdown(0);
      alert("SOS alert cancelled.");
    }
  };

  // Analyze the image using the AI model to get severity.
  const analyzeImageForSeverity = async (imageData: string) => {
    setIsAnalyzing(true);
    try {
      const analysisResult = await analyzeImage(imageData);
      if (analysisResult.accidentDetected) {
        setSeverity(analysisResult.severity || "Unknown");
      } else {
        setSeverity(null);
      }
    } catch (err) {
      console.error("AI analysis error:", err);
      setSeverity("Unknown");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Verify accident using AI analysis if needed.
  const verifyAccident = async (): Promise<{ accidentDetected: boolean; severity: string | null }> => {
    let imageData: string | null = capturedImage;
    if (!imageData && uploadedPhoto) {
      imageData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(uploadedPhoto);
      });
    }
    if (imageData) {
      try {
        const analysisResult = await analyzeImage(imageData);
        return {
          accidentDetected: analysisResult.accidentDetected,
          severity: analysisResult.severity || null,
        };
      } catch (err) {
        console.error("AI analysis error:", err);
        return { accidentDetected: false, severity: null };
      }
    }
    return { accidentDetected: false, severity: null };
  };

  // Submit SOS report automatically if accident is detected.
  const handleSubmitSOS = async () => {
    // Immediately prevent duplicate submissions
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setSosSent(true);
    if (autoSubmitTimer) {
      clearInterval(autoSubmitTimer);
      setAutoSubmitTimer(null);
    }
    
    // If severity isn't determined, verify accident now.
    if (!severity && (capturedImage || uploadedPhoto)) {
      const accidentInfo = await verifyAccident();
      if (!accidentInfo.accidentDetected) {
        alert("No accident detected from the photo evidence. SOS alert not sent.");
        setSosSent(false);
        isSubmittingRef.current = false;
        return;
      }
      if (accidentInfo.severity) {
        setSeverity(accidentInfo.severity);
      }
    }
    
    const userId = localStorage.getItem("user_id") || "0";
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("title", "SOS Alert");
    formData.append("description", description);
    formData.append("severity", severity || "Unknown");
    if (location) {
      formData.append("location", `${location.lat}, ${location.lng}`);
    }
    if (audioBlob) {
      formData.append("audio", audioBlob, "sos_audio.wav");
    }
    if (capturedImage) {
      const imageBlob = dataURLtoBlob(capturedImage);
      formData.append("image", imageBlob, "captured_image.jpg");
    } else if (uploadedPhoto) {
      formData.append("image", uploadedPhoto, uploadedPhoto.name);
    }
    if (uploadedVideo) {
      formData.append("video", uploadedVideo, uploadedVideo.name);
    }
    
    try {
      const response = await fetch("http://127.0.0.1:5000/api/sos/", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      
      alert("SOS emergency reported successfully!");
      console.log("Media uploaded:", {
        image: result.image_url,
        video: result.video_url,
        audio: result.audio_url,
      });
    } catch (err: any) {
      alert("Error reporting SOS: " + err.message);
      setSosSent(false); // Allow reattempt on error
      isSubmittingRef.current = false;
    }
  };

  // Handle photo upload and analyze it.
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          analyzeImageForSeverity(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // If there is an error, display it.
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="h-16 w-16 animate-spin mb-6 text-red-600" />
        <p className="text-2xl text-gray-800 font-bold">Fetching your location...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-red-500">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Section: SOS Info & Audio */}
            <div className="p-8 border-b md:border-b-0 md:border-r border-gray-300">
              <h2 className="text-4xl font-bold text-red-600 text-center mb-6">
                SOS Emergency
              </h2>
              {location && (
                <div className="text-center mb-6">
                  <p className="text-3xl font-semibold text-gray-800">
                    {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Your location will be shared with responders.
                  </p>
                </div>
              )}
              
              {/* Severity Display */}
              {isAnalyzing ? (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                  <p className="text-blue-800 flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" /> Analyzing situation...
                  </p>
                </div>
              ) : severity ? (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                  <h3 className="font-semibold text-red-800">
                    AI-Detected Severity: {severity}
                  </h3>
                </div>
              ) : null}
              
              {/* Audio Recording Status */}
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-center mb-6">
                <h3 className="font-semibold text-orange-800 flex items-center justify-center gap-2">
                  <Mic className="h-5 w-5" /> Audio Recording
                </h3>
                <p className="text-sm mt-2">
                  {audioBlob ? "Audio recorded successfully" : "Recording in progress..."}
                </p>
              </div>
              <div className="flex flex-col gap-6">
                {/* Auto submission info */}
                {autoSubmitTimer && (
                  <div className="text-center">
                    <p className="text-xl font-semibold text-red-600">
                      Auto submitting in {countdown} seconds...
                    </p>
                    <Button variant="outline" onClick={cancelSOS} className="mt-2 rounded-xl">
                      Cancel SOS
                    </Button>
                  </div>
                )}
              </div>
            </div>
            {/* Right Section: Media Evidence */}
            <div className="p-8">
              <Tabs defaultValue="photo">
                <TabsList className="grid grid-cols-3 gap-2">
                  <TabsTrigger value="photo">Photo</TabsTrigger>
                  <TabsTrigger value="video">Video</TabsTrigger>
                  <TabsTrigger value="webcam">Webcam</TabsTrigger>
                </TabsList>
                <TabsContent value="photo">
                  <div className="border-2 border-dashed border-red-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">Upload a photo</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="upload-photo"
                      onChange={handlePhotoUpload}
                    />
                    <Button variant="secondary" onClick={() => document.getElementById("upload-photo")?.click()}>
                      Choose Photo
                    </Button>
                    {uploadedPhoto && <p className="mt-2 text-sm">{uploadedPhoto.name}</p>}
                  </div>
                </TabsContent>
                <TabsContent value="video">
                  <div className="border-2 border-dashed border-red-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">Upload a video</p>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      id="upload-video"
                      onChange={(e) => {                        
                        if (e.target.files && e.target.files[0]) {                          
                          setUploadedVideo(e.target.files[0]);                        
                        }                      
                      }}                    
                    />                    
                    <Button variant="secondary" onClick={() => document.getElementById("upload-video")?.click()}>
                      Choose Video
                    </Button>                    
                    {uploadedVideo && <p className="mt-2 text-sm">{uploadedVideo.name}</p>}                  
                  </div>
                </TabsContent>
                <TabsContent value="webcam">
                  <div className="mt-4">
                    {!cameraActive && !capturedImage && (
                      <Button
                        onClick={startCamera}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3"
                        size="lg"
                      >
                        <Camera className="mr-2 h-6 w-6" />
                        Use Webcam
                      </Button>
                    )}
                    {cameraActive && (
                      <div className="space-y-4">
                        <div className="relative rounded-xl overflow-hidden bg-black">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-64 object-cover"
                          />
                          <div className="absolute bottom-2 inset-x-0 flex justify-center gap-2">
                            <Button
                              onClick={captureImage}
                              size="sm"
                              className="bg-white text-blue-600 hover:bg-blue-100 rounded-xl"
                            >
                              <Camera className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={resetCamera}
                              size="sm"
                              variant="destructive"
                              className="rounded-xl"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    {capturedImage && (
                      <div className="relative">
                        <img
                          src={capturedImage}
                          alt="Captured"
                          className="w-full h-64 object-cover rounded-xl shadow-lg"
                        />
                        <Button
                          onClick={resetCamera}
                          size="sm"
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 rounded-xl"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              {/* Media upload status */}
              <div className="mt-6">
                {(uploadedPhoto || capturedImage || uploadedVideo) && (
                  <Alert className="bg-green-50 border-green-200">
                    <AlertDescription className="text-green-800">
                      {uploadedPhoto || capturedImage ? "✓ Photo ready" : ""}
                      {uploadedVideo ? "✓ Video ready" : ""}
                      {severity ? ` - Severity: ${severity}` : ""}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}