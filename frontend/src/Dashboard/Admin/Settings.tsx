// src/Dashboard/Admin/AdminSettings.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminSettings() {
  const [siteTitle, setSiteTitle] = useState("ResQ Bridge");
  const [contactEmail, setContactEmail] = useState("contact@example.com");

  const handleSave = () => {
    // Implement your save logic (e.g., API call) here.
    alert("Settings saved!");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
      <Card className="p-6 bg-white rounded-lg shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-red-600">General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="siteTitle" className="block text-sm font-medium text-gray-700">
                Site Title
              </Label>
              <Input
                id="siteTitle"
                type="text"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                placeholder="ResQ Bridge"
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <Label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                Contact Email
              </Label>
              <Input
                id="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="contact@example.com"
                className="mt-1 block w-full"
              />
            </div>
          </div>
        </CardContent>
        <div className="p-4">
          <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700 text-white">
            Save Settings
          </Button>
        </div>
      </Card>
    </div>
  );
}
