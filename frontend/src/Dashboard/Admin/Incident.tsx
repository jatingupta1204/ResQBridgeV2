import { useState, useEffect } from "react";
import { getIncidents, updateIncident, deleteIncident } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash } from "lucide-react";

interface Incident {
  id: number;
  title: string;
  description: string;
  location: string;
  contact: string;
  status: string;
  reported_at: string;
}

export default function IncidentPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Editing state
  const [editingIncidentId, setEditingIncidentId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const [editLocation, setEditLocation] = useState<string>("");
  const [editContact, setEditContact] = useState<string>("");
  const [editStatus, setEditStatus] = useState<string>("");

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token not found");
      const data = await getIncidents(token);
      setIncidents(data);
    } catch (err: any) {
      setError(err.message || "Error fetching incidents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleEdit = (incident: Incident) => {
    setEditingIncidentId(incident.id);
    setEditTitle(incident.title);
    setEditDescription(incident.description);
    setEditLocation(incident.location);
    setEditContact(incident.contact);
    setEditStatus(incident.status);
  };

  const handleCancelEdit = () => {
    setEditingIncidentId(null);
    setEditTitle("");
    setEditDescription("");
    setEditLocation("");
    setEditContact("");
    setEditStatus("");
  };

  const handleSaveEdit = async (incidentId: number) => {
    try {
      const updatedReport = await updateIncident(incidentId, {
        title: editTitle,
        description: editDescription,
        location: editLocation,
        contact: editContact,
        status: editStatus,
      });
      if (updatedReport.error) {
        alert(updatedReport.error);
      } else {
        alert("Incident updated successfully");
        await loadIncidents();
        handleCancelEdit();
      }
    } catch (err: any) {
      alert(err.message || "Error updating incident");
    }
  };

  const handleDelete = async (incidentId: number) => {
    if (window.confirm("Are you sure you want to delete this incident?")) {
      try {
        const response = await deleteIncident(incidentId);
        if (response.error) {
          alert(response.error);
        } else {
          alert("Incident deleted successfully");
          await loadIncidents();
        }
      } catch (err: any) {
        alert(err.message || "Error deleting incident");
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading incidents...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">{error}</div>;
  }

  return (
    <div className="space-y-8 px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800">Incidents</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Status</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {incidents.map((incident) => (
              <tr key={incident.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap border-r">
                  {editingIncidentId === incident.id ? (
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{incident.title}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-r">
                  {editingIncidentId === incident.id ? (
                    <Input
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{incident.description}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-r">
                  {editingIncidentId === incident.id ? (
                    <Input
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{incident.location}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-r">
                  {editingIncidentId === incident.id ? (
                    <Input
                      value={editContact}
                      onChange={(e) => setEditContact(e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{incident.contact}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-r">
                  {editingIncidentId === incident.id ? (
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full border rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-300 transition"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  ) : (
                    <span className="text-sm text-gray-900">{incident.status}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {editingIncidentId === incident.id ? (
                    <div className="flex justify-center gap-3">
                      <Button onClick={() => handleSaveEdit(incident.id)} className="bg-green-600 hover:bg-green-700 text-white">
                        Save
                      </Button>
                      <Button onClick={handleCancelEdit} variant="outline" className="text-gray-700">
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-center gap-3">
                      <Button onClick={() => handleEdit(incident)} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => handleDelete(incident.id)} variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}         
            </tbody>      
            </table>     
            </div>   
            </div> 
            );
}