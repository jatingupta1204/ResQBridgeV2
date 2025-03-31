// Dashboard/Admin/AdminLayout.tsx
import { Outlet } from "react-router-dom";
import {AdminSidebar} from "../components/AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
