"use client";

import { useState, useEffect } from "react";
import { getSOSReports, updateSOSReport, deleteSOSReport } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash } from "lucide-react";
import { Loader2, AlertCircle } from "lucide-react";

interface SOSReport {
  id: number;
  title: string; // Present in the model but not displayed in the table
  location: string;
  severity: string;
  status: string;
  audio_url?: string;
  image_url?: string;
  video_url?: string;
  reported_at: string; // Present in model but not displayed
}

export default function AdminSOSPage() {
  const [reports, setReports] = useState<SOSReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<SOSReport>>({});

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await getSOSReports();
      if (Array.isArray(data)) setReports(data);
      else setError("Unexpected response format");
    } catch (err: any) {
      setError(err.message || "Error fetching SOS reports");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (report: SOSReport) => {
    setEditingId(report.id);
    // Copy only the fields we want to edit
    setEditData({ 
      location: report.location, 
      severity: report.severity, 
      status: report.status 
    });
  };

  const handleChange = (field: keyof SOSReport, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (id: number) => {
    try {
      await updateSOSReport(id, editData);
      alert("SOS report updated successfully");
      await loadReports();
      setEditingId(null);
    } catch (err: any) {
      alert("Failed to update SOS report");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      await deleteSOSReport(id);
      alert("SOS report deleted successfully");
      await loadReports();
    } catch (err: any) {
      alert("Failed to delete SOS report");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <Loader2 className="w-10 h-10 text-gray-600 animate-spin" />
        <p className="mt-4 text-gray-600">Loading SOS reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-600">
        <AlertCircle className="w-10 h-10" />
        <p className="mt-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold text-gray-800 text-center">SOS Reports</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
          <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-2 border-r">Location</th>
              <th className="px-4 py-2 border-r">Severity</th>
              <th className="px-4 py-2 border-r">Status</th>
              <th className="px-4 py-2 border-r">Audio</th>
              <th className="px-4 py-2 border-r">Image</th>
              <th className="px-4 py-2 border-r">Video</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50 transition">
                {editingId === report.id ? (
                  <>
                    <td className="px-4 py-2 border-r">
                      <Input value={editData.location || ""} onChange={(e) => handleChange("location", e.target.value)} className="w-full" />
                    </td>
                    <td className="px-4 py-2 border-r">
                      <Input value={editData.severity || ""} onChange={(e) => handleChange("severity", e.target.value)} className="w-full" />
                    </td>
                    <td className="px-4 py-2 border-r">
                      <select
                        value={editData.status || ""}                       
                        onChange={(e) => handleChange("status", e.target.value)}                      
                        className="w-full border rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-300 transition"
                      >                     
                        <option value="Pending">Pending</option>                        
                        <option value="In Progress">In Progress</option>                      
                        <option value="Resolved">Resolved</option>                      
                      </select>                   
                    </td>                  
                  </>                
                ) : (                
                  <>                  
                    <td className="px-4 py-2 border-r">
                      {report.location}
                    </td>                    
                    <td className="px-4 py-2 border-r">
                      {report.severity}
                    </td>                   
                    <td className="px-4 py-2 border-r">
                      {report.status}
                    </td>                 
                  </>               
                )}              
                <td className="px-4 py-2 text-center border-r">
                  {report.audio_url ? (                 
                    <a href={report.audio_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Listen
                    </a>
                  ) : (
                    <span>N/A</span>
                  )}
                </td>
                <td className="px-4 py-2 text-center border-r">
                  {report.image_url ? (
                    <a href={report.image_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View
                    </a>
                  ) : (
                    <span>N/A</span>
                  )}
                </td>
                <td className="px-4 py-2 text-center border-r">
                  {report.video_url ? (
                    <a href={report.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Watch
                    </a>
                  ) : (
                    <span>N/A</span>
                  )}
                </td>
                <td className="px-4 py-2 text-center flex justify-center gap-2">
                  {editingId === report.id ? (
                    <>
                      <Button onClick={() => handleSave(report.id)} className="bg-green-600 hover:bg-green-700 text-white">
                        Save
                      </Button>
                      <Button onClick={handleCancelEdit} variant="outline" className="text-gray-700">
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => handleEdit(report)} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => handleDelete(report.id)} variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </>
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