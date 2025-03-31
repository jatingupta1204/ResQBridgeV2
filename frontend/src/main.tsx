// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import AboutPage from "./Pages/AboutPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import ReportPage from "./components/ReportPage";
import SOSPage from "./components/SOSPage";
import CrowdsourcingPage from "./components/CrowdsourcingPage";
import Predict from "./Pages/Predict";
import AdminLayout from "./Layout/AdminLayout";
import AdminDashboard from "./Dashboard/Admin/Home";
import AdminUsers from "./Dashboard/Admin/Users";
import AdminSOSPage from "./Dashboard/Admin/AdminSOS";
import AdminIncident from "./Dashboard/Admin/Incident";
import AdminSettings from "./Dashboard/Admin/Settings";
import AdminDonations from "./Dashboard/Admin/AdminDonations";
import AudioTranscription from "./Pages/AudioTranscription";
import "./index.css";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/report", element: <ReportPage /> },
  { path: "/sos", element: <SOSPage /> },
  { path: "/crowdsourcing", element: <CrowdsourcingPage /> },
  { path: "/predict", element: <Predict /> },
  { path: "/nlp", element: <AudioTranscription /> },
  {
    path: "/dashboard",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "incidents", element: <AdminIncident /> },
      { path: "users", element: <AdminUsers /> },
      { path: "donations", element: <AdminDonations /> },
      { path: "sos-reports", element: <AdminSOSPage /> },
      { path: "settings", element: <AdminSettings /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
