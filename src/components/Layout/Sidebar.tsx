import React from "react";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  MessageSquare,
  Users,
  Settings,
  Shield,
} from "lucide-react";
import { authService } from "../../services/authService";
import { NavLink } from "react-router-dom";

const allMenuItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  {
    path: "/forms/create",
    label: "Criar Questionário",
    icon: FileText,
    adminOnly: true,
  },
  {
    path: "/forms",
    label: "Meus Questionários",
    icon: FolderOpen,
    adminOnly: true,
    end: true,
  },
  { path: "/responses", label: "Respostas", icon: MessageSquare, end: true },
  { path: "/users", label: "Usuários", icon: Users, adminOnly: true },
  { path: "/settings", label: "Configurações", icon: Settings, end: true },
];

const Sidebar: React.FC = () => {
  const authUser = authService.getAuthUser();
  const isAdmin = authUser?.role === "Administrador";

  const menuItems = allMenuItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">TEA Assessment</h2>
            <div className="flex items-center space-x-1">
              {isAdmin && <Shield className="w-3 h-3 text-blue-400" />}
              <p className="text-sm text-slate-400">
                {isAdmin ? "Administrador" : "Cliente"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.end} // só aplica quando definirmos no array
                  className={({ isActive }) =>
                    `w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Rodapé */}
      <div className="p-4 border-t border-slate-700">
        <div className="text-xs text-slate-400 text-center">
          © 2025 TEA Assessment System
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
