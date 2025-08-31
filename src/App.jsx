// src/App.jsx (Recommended Final Version)
import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

// Layouts and Route Guards
import ProtectedRoute from "./components/protectedRoutes";
import DashboardLayout from "./Layouts/DashboardLayout";

// Page Components
import Home from "./views/Home";
import UploadDocument from "./views/UploadDocument";
import Casepdf from "./components/CasePdf/Casepdf";
import NotebookPage from "./views/Notebook";
import RegisterPage from "./views/Register";
import LoginPage from "./views/Login";
import MainHome from "./views/MainHome"; // Your Landing Page
import NoteBookMain from "./components/notebook/NotebookPage";

// This component decides where to send the user when they first visit.
function RootRedirect() {
  const user = localStorage.getItem("user");
  return user ? <Navigate to="/" replace /> : <Navigate to="/" replace />;
}

export default function App() {
  const [isContrast, setIsContrast] = useState(false);

  return (
    <div className={`${isContrast ? "invert contrast-150 saturate-200 brightness-125" : ""}`}>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<MainHome setContrast={setIsContrast} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* --- Protected Routes --- */}
        {/* This is a layout route. All nested routes will render inside its <Outlet>. */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <DashboardLayout isContrast={isContrast} setIsContrast={setIsContrast} />
            </ProtectedRoute>
          }
        >
          {/* Default child route for the dashboard ("/") */}
          <Route index element={<Home />} /> 
          <Route path=":id" element={<Home />} />
          <Route path=":id/source/:source" element={<Casepdf />} />
          <Route path="upload" element={<UploadDocument />} />
          <Route path="upload/:id" element={<UploadDocument />} />
          <Route path="notebook" element={<NotebookPage />} />
          <Route path="notebook/:id" element={<NoteBookMain />} />
        </Route>

        {/* --- Fallback / Entry Point --- */}
        {/* If any other path is entered, this logic runs. */}
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </div>
  );
}