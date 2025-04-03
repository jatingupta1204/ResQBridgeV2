// AboutPage.tsx
import { Header } from "../components/Header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Mission Section */}
          <section className="text-center py-12 md:py-24">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About{" "}
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-pink-600">
                ResQ Bridge
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Revolutionizing emergency response with innovative technology
              for faster, more efficient service.
            </p>
          </section>

          {/* Stats Section */}
          <section className="py-12 bg-white rounded-xl shadow-sm mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4">
                <p className="text-4xl font-bold text-red-600 mb-2">500+</p>
                <p className="text-sm text-muted-foreground">
                  Emergencies Handled
                </p>
              </div>
              <div className="p-4">
                <p className="text-4xl font-bold text-red-600 mb-2">5 min</p>
                <p className="text-sm text-muted-foreground">
                  Average Response Time
                </p>
              </div>
              <div className="p-4">
                <p className="text-4xl font-bold text-red-600 mb-2">98%</p>
                <p className="text-sm text-muted-foreground">
                  Success Rate
                </p>
              </div>
            </div>
          </section>

          {/* Info Sections */}
          <section className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white shadow-md border border-red-100 rounded-xl p-6">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-red-600">
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  ResQ Bridge harnesses cutting-edge technology and data analytics
                  to connect those in need with professional emergency services.
                  Our platform minimizes response times and maximizes efficiency,
                  ensuring help is always within reach.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-md border border-red-100 rounded-xl p-6">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-red-600">
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>1. Emergencies are reported instantly through our platform.</li>
                  <li>
                    2. AI algorithms detect and verify incidents in real time.
                  </li>
                  <li>
                    3. Automatic alerts are sent to professional emergency services.
                  </li>
                  <li>
                    4. Real-time updates ensure efficient coordination and response.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </>
  );
}
