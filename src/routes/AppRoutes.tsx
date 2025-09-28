import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Páginas
import Dashboard from "../pages/Dashboard";
import CreateForm from "../pages/CreateForm";
import MyForms from "../pages/MyForms";
import EditForm from "../pages/EditForm";
import Responses from "../pages/Responses";
import Users from "../pages/Users";
import Settings from "../pages/Settings";
import ViewForm from "../pages/ViewForm";

const AppRoutes: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/forms" element={<MyForms />} />
            <Route path="/forms/create" element={<CreateForm />} />
            <Route path="/forms/:id/edit" element={<EditForm />} />
            <Route path="/forms/:id/view" element={<ViewForm />} />
            <Route path="/responses" element={<Responses />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AppRoutes;
