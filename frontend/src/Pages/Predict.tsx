import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { analyzeImage } from "@/api";

interface Detection {
  class: string;
  confidence: number;
  severity?: string;
  coordinates?: number[];
}

interface AnalyzeResult {
  success: boolean;
  accidentDetected: boolean;
  detection?: Detection;
  processedImage?: string;
}

export default function Predict() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzedUrl, setAnalyzedUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [imageFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setResult(null);
      setAnalyzedUrl(null);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject("Error reading file");
      reader.readAsDataURL(file);
    });

  const handleAnalyze = async () => {
    if (!imageFile) {
      setError("Please select an image to analyze.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    setAnalyzedUrl(null);

    try {
      const base64 = await convertFileToBase64(imageFile);
      const response = await analyzeImage(base64);
      setResult(response);

      if (response.processedImage) {
        setAnalyzedUrl(response.processedImage);
      }
    } catch (err: any) {
      setError(err.message || "Error analyzing image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">Accident Detection</h1>
      
      <Card className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6">
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {previewUrl && <img src={previewUrl} alt="Preview" className="max-w-md rounded-lg" />}
          <Button onClick={handleAnalyze} disabled={loading || !imageFile}>
            {loading ? "Analyzing..." : "Analyze Image"}
          </Button>
          {error && <Alert variant="destructive">{error}</Alert>}
        </CardContent>
      </Card>

      {result && (
        <Card className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 mt-6">
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            {analyzedUrl && <img src={analyzedUrl} alt="Analyzed Image" className="max-w-md rounded-lg" />}
            <div className="w-full text-left">
              <p className="text-lg font-semibold">Accident Detected: 
                <span className={result.accidentDetected ? "text-red-500" : "text-green-500"}>
                  {result.accidentDetected ? " Yes" : " No"}
                </span>
              </p>
              {result.detection && (
                <>
                  <p className="text-lg font-semibold">Class: <span className="text-gray-700">{result.detection.class}</span></p>
                  <p className="text-lg font-semibold">Confidence: <span className="text-gray-700">{(result.detection.confidence * 100).toFixed(2)}%</span></p>
                  <p className="text-lg font-semibold">Severity: <span className="text-gray-700">{result.detection.severity || "Unknown"}</span></p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
