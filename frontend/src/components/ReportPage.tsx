// At the top of your file, declare the "google" property on window.
declare global {
  interface Window {
    google: any;
  }
}

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/Header";
import { AlertTriangle } from "lucide-react";
import { createIncident } from "@/api";

const GOOGLE_MAPS_API_KEY = ""; // Add your API key here

// Hook to dynamically load the Google Maps API script
function useLoadGoogleMaps(apiKey: string) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [apiKey]);

  return loaded;
}

const center = { lat: 0, lng: 0 };

export default function ReportPage() {
  const googleLoaded = useLoadGoogleMaps(GOOGLE_MAPS_API_KEY);

  const [location, setLocation] = useState(center);
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocationDetecting, setIsLocationDetecting] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const form = useForm({
    defaultValues: {
      type: "",
      description: "",
      contact: "",
    },
  });

  // Get user's location on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(newLocation);
        if (googleLoaded && window.google) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: newLocation }, (results: any, status: string) => {
            if (status === "OK" && results[0]) {
              setAddress(results[0].formatted_address);
            }
          });
        }
        setLoading(false);
      },
      () => {
        setError("Unable to get your location. Please enable location services.");
        setLoading(false);
      }
    );
  }, [googleLoaded]);

  const detectLocation = () => {
    setIsLocationDetecting(true);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setIsLocationDetecting(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(newLocation);
        if (googleLoaded && window.google) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: newLocation }, (results: any, status: string) => {
            if (status === "OK" && results[0]) {
              setAddress(results[0].formatted_address);
            }
          });
        }
        setIsLocationDetecting(false);
      },
      (err) => {
        console.error("Error getting location:", err);
        setError("Unable to detect location. Please try again or enter location manually.");
        setIsLocationDetecting(false);
      }
    );
  };

  async function onSubmit(values: any) {
    setIsSubmitting(true);
    if (location.lat === 0 && location.lng === 0) {
      alert("Location not detected. Please enable location services or select a valid location.");
      setIsSubmitting(false);
      return;
    }
    const payload = {
      title: `${values.type}`,
      location: address || `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`,
      reportedAt: new Date().toISOString(),
      status: "Pending",
      description: values.description,
      contact: values.contact,
      emergencyType: values.type,
    };
    try {
      const response = await createIncident(payload);
      if (response.error) {
        alert(response.error);
      } else {
        alert("Emergency report submitted successfully!");
        form.reset();
      }
    } catch (err: any) {
      alert(err.message || "Error submitting emergency report");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-red-600 text-center">
          Report an Emergency
        </h1>

        <Card className="border border-red-100 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />
              Emergency Details
            </CardTitle>
            <CardDescription>
              Provide as much information as possible about the emergency.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Emergency Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fire">Fire</SelectItem>
                          <SelectItem value="medical">Medical Emergency</SelectItem>
                          <SelectItem value="break">Break Down</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Location</FormLabel>
                  <div className="text-sm text-muted-foreground mb-2">
                    <p>
                      Current location:{" "}
                      {address || `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`}
                    </p>
                  </div>
                  <Button type="button" onClick={detectLocation} disabled={isLocationDetecting}>
                    {isLocationDetecting ? "Detecting..." : "Redetect Location"}
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the emergency" {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <div className="text-sm font-medium text-destructive">{error}</div>
                )}

                <CardFooter className="flex justify-between px-0">
                  <Button type="button" variant="outline" onClick={() => form.reset()}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Report"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}