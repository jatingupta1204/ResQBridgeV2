// App.tsx
import React from "react";
import { Header } from "./components/Header";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./components/ui/card";
import {
  AlertCircle,
  FileHeart,
  Shield,
  Activity,
  Clock,
  MapPin,
  Heart,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

const App: React.FC = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-12 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-rose-50 opacity-50 z-0"></div>
          <div className="relative z-10">
            {/* Removed the Community Powered badge */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Emergency Response Made{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-pink-600">
                Simple
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connecting citizens with professional emergency services in real-time for faster, more efficient response.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                variant="destructive"
                size="lg"
                asChild
                className="animate-pulse"
              >
                <Link to="/sos">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  SOS Emergency
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-red-600 hover:bg-red-700"
              >
                <Link to="/report">Report Emergency</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/crowdsourcing">
                  <Heart className="mr-2 h-4 w-4" />
                  Support Our Mission
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white rounded-xl shadow-sm mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <p className="text-4xl font-bold text-red-600 mb-2">3,892</p>
              <p className="text-sm text-muted-foreground">Emergencies Handled</p>
            </div>
            <div className="p-4">
              <p className="text-4xl font-bold text-red-600 mb-2">5 min</p>
              <p className="text-sm text-muted-foreground">Average Response Time</p>
            </div>
            <div className="p-4">
              <p className="text-4xl font-bold text-red-600 mb-2">42</p>
              <p className="text-sm text-muted-foreground">Cities Covered</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-12">
            How ResQ Bridge Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Report Accident Card */}
            <Card className="border-red-100 shadow-md hover:shadow-lg transition-all flex flex-col">
              <CardHeader>
                <AlertCircle className="w-10 h-10 text-red-600 mb-2" />
                <CardTitle>Report Accidents</CardTitle>
                <CardDescription>
                  Quickly report accidents with precise location and details.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                Submit emergency reports with photos, audio, and location data for immediate service dispatch.
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link to="/report">Report Now</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Request Service Card */}
            <Card className="border-red-100 shadow-md hover:shadow-lg transition-all flex flex-col">
              <CardHeader>
                <Shield className="w-10 h-10 text-red-600 mb-2" />
                <CardTitle>Request Service</CardTitle>
                <CardDescription>
                  Get immediate help from professional services.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                Our system alerts the appropriate emergency service providers near you for a rapid response.
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link to="/request-service">Request Now</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Track Progress Card */}
            <Card className="border-red-100 shadow-md hover:shadow-lg transition-all flex flex-col">
              <CardHeader>
                <Clock className="w-10 h-10 text-red-600 mb-2" />
                <CardTitle>Track Progress</CardTitle>
                <CardDescription>
                  Real-time updates on service arrival.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                Stay informed with live updates on the status and estimated arrival time of emergency services.
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link to="/track">Track Now</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Save Lives Card */}
            <Card className="border-red-100 shadow-md hover:shadow-lg transition-all flex flex-col">
              <CardHeader>
                <FileHeart className="w-10 h-10 text-red-600 mb-2" />
                <CardTitle>Save Lives</CardTitle>
                <CardDescription>
                  Contribute to improving emergency response.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                Support our mission through donations to enhance emergency services and save lives.
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link to="/donate">Donate Now</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-slate-50 rounded-xl my-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Emergency Response Journey</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From reporting an emergency to receiving professional help, we’re with you every step of the way.
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col items-center justify-between min-h-[200px]">
                <div>
                  <div className="bg-red-100 text-red-800 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Report Emergency</h3>
                  <p className="text-sm text-muted-foreground">
                    Use our SOS button or report form to alert services.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-between min-h-[200px]">
                <div>
                  <div className="bg-red-100 text-red-800 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <Activity className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Service Dispatched</h3>
                  <p className="text-sm text-muted-foreground">
                    Professional services are notified immediately.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-between min-h-[200px]">
                <div>
                  <div className="bg-red-100 text-red-800 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Quick Response</h3>
                  <p className="text-sm text-muted-foreground">
                    Track service arrival time and updates in real-time.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-between min-h-[200px]">
                <div>
                  <div className="bg-red-100 text-red-800 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Resolution</h3>
                  <p className="text-sm text-muted-foreground">
                    Emergency resolved with professional assistance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl my-12">
          <div className="text-center max-w-3xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Learn More About Our Mission
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Discover how our technology is transforming emergency response and saving lives.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-red-600"
                asChild
              >
                <Link to="/about">
                  Learn More
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default App;
