// CrowdsourcingPage.tsx
import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Gift, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function CrowdsourcingPage() {
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      alert("Thank you for your donation!");
      setIsSubmitting(false);
      setAmount("");
      setCustomAmount("");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setAnonymous(false);
    }, 1500);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4 text-red-600">Support Our Community</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Contribute to our emergency response initiative. Every donation helps save lives.
            </p>
          </div>

          {/* Fundraising Progress Card */}
          <div className="grid grid-cols-1 gap-8 mb-10">
            <Card className="border-red-200 shadow-md">
              <CardHeader className="bg-red-50 border-b border-red-100">
                <div className="flex items-center gap-3">
                  <div className="bg-red-600 text-white p-2 rounded-full">
                    <Gift className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>Fundraising Progress</CardTitle>
                    <CardDescription>Help us reach our goal</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-red-600">₹7,50,000 raised</span>
                      <span className="text-muted-foreground">of ₹10,00,000 goal</span>
                    </div>
                    <Progress value={75} className="h-3" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-3xl font-bold text-red-600">278</p>
                      <p className="text-sm text-muted-foreground">Donors</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-red-600">42</p>
                      <p className="text-sm text-muted-foreground">Days Left</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-red-600">₹22,950</p>
                      <p className="text-sm text-muted-foreground">Avg Donation</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Donation Form (Single Tab) */}
          <Tabs defaultValue="donate" className="w-full">
            <TabsList className="grid grid-cols-1 w-full max-w-md mx-auto mb-8">
              <TabsTrigger value="donate" className="text-lg">
                <Heart className="mr-2 h-4 w-4" />
                Donate
              </TabsTrigger>
            </TabsList>

            <TabsContent value="donate">
              <Card>
                <CardHeader>
                  <CardTitle>Make a Donation</CardTitle>
                  <CardDescription>
                    Your contribution helps us provide better emergency response services.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleDonationSubmit} className="space-y-6">
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        type="button"
                        variant={amount === "25" ? "default" : "outline"}
                        className="text-lg font-medium"
                        onClick={() => {
                          setAmount("25");
                          setCustomAmount("");
                        }}
                      >
                        ₹100
                      </Button>
                      <Button
                        type="button"
                        variant={amount === "50" ? "default" : "outline"}
                        className="text-lg font-medium"
                        onClick={() => {
                          setAmount("50");
                          setCustomAmount("");
                        }}
                      >
                        ₹500
                      </Button>
                      <Button
                        type="button"
                        variant={amount === "100" ? "default" : "outline"}
                        className="text-lg font-medium"
                        onClick={() => {
                          setAmount("100");
                          setCustomAmount("");
                        }}
                      >
                        ₹1,000
                      </Button>
                      <Button
                        type="button"
                        variant={amount === "250" ? "default" : "outline"}
                        className="text-lg font-medium"
                        onClick={() => {
                          setAmount("250");
                          setCustomAmount("");
                        }}
                      >
                        ₹5,000
                      </Button>
                      <Button
                        type="button"
                        variant={amount === "500" ? "default" : "outline"}
                        className="text-lg font-medium"
                        onClick={() => {
                          setAmount("500");
                          setCustomAmount("");
                        }}
                      >
                        ₹10,000
                      </Button>
                      <Button
                        type="button"
                        variant={amount === "custom" ? "default" : "outline"}
                        className="text-lg font-medium"
                        onClick={() => setAmount("custom")}
                      >
                        Custom
                      </Button>
                    </div>

                    {amount === "custom" && (
                      <div className="space-y-2">
                        <Label htmlFor="customAmount">Custom Amount ($)</Label>
                        <Input
                          id="customAmount"
                          type="number"
                          placeholder="Enter amount"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          required
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={!anonymous}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (optional)</Label>
                      <Input
                        id="phone"
                        placeholder="Your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message (optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Your message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="anonymous"
                        checked={anonymous}
                        onCheckedChange={(checked) => setAnonymous(checked as boolean)}
                      />
                      <label
                        htmlFor="anonymous"
                        className="text-sm font-medium leading-none"
                      >
                        Make my donation anonymous
                      </label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-red-600 hover:bg-red-700"
                      size="lg"
                      disabled={isSubmitting || (!amount && !customAmount)}  
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Donate Now"
                      )}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="bg-red-50 border-t border-red-100 flex justify-center">
                  <p className="text-sm text-center text-muted-foreground">
                    Your donation is tax-deductible. You will receive a receipt via email.
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">Recent Supporters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Rachit", amount: "₹1,000", message: "Happy to support this important cause!", date: "2 days ago" },
                { name: "Khushi", amount: "₹500", message: "", date: "3 days ago" },
                { name: "Jatin", amount: "₹10,000", message: "Keep up the great work saving lives!", date: "1 week ago" },
                { name: "Vasu", amount: "₹100", message: "In memory of my father", date: "1 week ago" },
                { name: "Community Health Partners", amount: "₹1,000", message: "Supporting our emergency services", date: "2 weeks ago" },
                { name: "Rohan", amount: "₹5,000", message: "Thank you for your service", date: "2 weeks ago" }
              ].map((donor, index) => (
                <Card key={index} className="bg-slate-50">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{donor.name}</h3>
                        <p className="text-sm text-muted-foreground">{donor.date}</p>
                      </div>
                      <div className="text-red-600 font-medium">{donor.amount}</div>
                    </div>
                    {donor.message && <p className="text-sm mt-2 italic">"{donor.message}"</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
