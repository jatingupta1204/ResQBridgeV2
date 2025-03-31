// src/Dashboard/Admin/AdminSidebar.tsx
import { NavLink, useNavigate } from "react-router-dom";
import { Home, FileText, Bell, Users, IndianRupee, Settings, LogOut } from "lucide-react";

export function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user authentication data (e.g., tokens)
    localStorage.removeItem("authToken");
    // Redirect to the login page
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-white shadow-lg border-r border-gray-200 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-red-600">ResQ Bridge</h1>
      </div>
      <nav className="space-y-2">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200 ${
              isActive
                ? "bg-red-50 text-red-600 font-medium"
                : "text-gray-700 hover:bg-red-50"
            }`
          }
        >
          <Home className="h-5 w-5" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/dashboard/incidents"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200 ${
              isActive
                ? "bg-red-50 text-red-600 font-medium"
                : "text-gray-700 hover:bg-red-50"
            }`
          }
        >
          <FileText className="h-5 w-5" />
          <span>Incidents</span>
        </NavLink>
        <NavLink
          to="/dashboard/sos-reports"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200 ${
              isActive
                ? "bg-red-50 text-red-600 font-medium"
                : "text-gray-700 hover:bg-red-50"
            }`
          }
        >
          <Bell className="h-5 w-5" />
          <span>SOS Reports</span>
        </NavLink>
        <NavLink
          to="/dashboard/users"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200 ${
              isActive
                ? "bg-red-50 text-red-600 font-medium"
                : "text-gray-700 hover:bg-red-50"
            }`
          }
        >
          <Users className="h-5 w-5" />
          <span>Users</span>
        </NavLink>
        <NavLink
          to="/dashboard/donations"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200 ${
              isActive
                ? "bg-red-50 text-red-600 font-medium"
                : "text-gray-700 hover:bg-red-50"
            }`
          }
        >
          <IndianRupee className="h-5 w-5" />
          <span>Donations</span>
        </NavLink>
        <NavLink
          to="/dashboard/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200 ${
              isActive
                ? "bg-red-50 text-red-600 font-medium"
                : "text-gray-700 hover:bg-red-50"
            }`
          }
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 rounded-md transition-colors duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}
