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

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const allMenuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    id: "create-form",
    label: "Criar Questionário",
    icon: FileText,
    adminOnly: true,
  },
  {
    id: "my-forms",
    label: "Meus Questionários",
    icon: FolderOpen,
    adminOnly: true,
  },
  { id: "responses", label: "Respostas", icon: MessageSquare },
  { id: "users", label: "Usuários", icon: Users, adminOnly: true },
  { id: "settings", label: "Configurações", icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const authUser = authService.getAuthUser();
  const isAdmin = authUser?.role === "Administrador";

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
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

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="text-xs text-slate-400 text-center">
          © 2025 TEA Assessment System
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
