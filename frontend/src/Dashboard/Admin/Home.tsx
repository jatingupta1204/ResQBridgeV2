// Dashboard/Admin/Home.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface Metrics {
  incidents: number;
  users: number;
  donations: number;
}

interface Incident {
  id: number;
  title: string;
  status: string;
  reportedAt: string;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<Metrics>({ incidents: 0, users: 0, donations: 0 });
  const [incidents, setIncidents] = useState<Incident[]>([]);

  // Simulated API call for metrics – replace with your actual API call.
  const fetchMetrics = async (): Promise<Metrics> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          incidents: 123,
          users: 456,
          donations: 789000,
        });
      }, 500);
    });
  };

  // Simulated API call for recent incidents – replace with your actual API call.
  const fetchIncidents = async (): Promise<Incident[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, title: "Fire at Main Street", status: "Pending", reportedAt: "2023-03-01" },
          { id: 2, title: "Medical Emergency on 5th Ave", status: "Resolved", reportedAt: "2023-03-02" },
          { id: 3, title: "Vehicle Breakdown on Highway", status: "In Progress", reportedAt: "2023-03-03" },
        ]);
      }, 500);
    });
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedMetrics, fetchedIncidents] = await Promise.all([
        fetchMetrics(),
        fetchIncidents(),
      ]);
      setMetrics(fetchedMetrics);
      setIncidents(fetchedIncidents);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header Section with Refresh Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button 
          onClick={loadData}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
        >
          Refresh
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white rounded-lg shadow">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-red-600">Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metrics.incidents}</p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">Total reported incidents</p>
          </CardFooter>
        </Card>
        <Card className="p-6 bg-white rounded-lg shadow">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-red-600">Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metrics.users}</p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">Registered users</p>
          </CardFooter>
        </Card>
        <Card className="p-6 bg-white rounded-lg shadow">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-red-600">Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{metrics.donations.toLocaleString()}</p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">Total donations received</p>
          </CardFooter>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition">
            Manage Incidents
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition">
            Manage Users
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition">
            View Reports
          </button>
        </div>
      </div>

      {/* Incident Trends Chart Placeholder */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Incident Trends</h2>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md">
          <p className="text-gray-500">[Chart Placeholder: Incident Trends]</p>
        </div>
      </div>

      {/* Recent Incidents Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Incidents</h2>
        <div className="space-y-4">
          {incidents.map((incident) => (
            <Card key={incident.id} className="p-4 bg-white rounded-lg shadow">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{incident.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Status: {incident.status}</p>
                <p className="text-sm text-gray-600">Reported at: {incident.reportedAt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
