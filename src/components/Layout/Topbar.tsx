import React from 'react';
import { User, LogOut, Bell, Search, Shield } from 'lucide-react';
import { authService } from '../../services/authService';

interface TopbarProps {
  onLogout: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onLogout }) => {
  const authUser = authService.getAuthUser();
  
  const handleLogout = () => {
    authService.logout();
    onLogout();
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-slate-800">
          Sistema de Avaliação Comportamental TEA
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Notifications */}
        <button className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        
        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-slate-800">{authUser?.fullName || 'Usuário'}</p>
            <div className="flex items-center space-x-1">
              {authUser?.role === 'Administrador' && <Shield className="w-3 h-3 text-blue-600" />}
              <p className="text-xs text-slate-500">{authUser?.role || 'Cliente'}</p>
            </div>
          </div>
          <button className="flex items-center space-x-2 p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </button>
        </div>
        
        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Sair"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Topbar;