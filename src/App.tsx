import React, { useState, useEffect } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Topbar from './components/Layout/Topbar';
import Dashboard from './pages/Dashboard';
import CreateForm from './pages/CreateForm';
import MyForms from './pages/MyForms';
import Responses from './pages/Responses';
import Users from './pages/Users';
import Settings from './pages/Settings';
import WelcomePage from './pages/auth/WelcomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import { authService } from './services/authService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<'welcome' | 'login' | 'register'>('welcome');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthView('welcome');
    setActiveTab('dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    switch (authView) {
      case 'login':
        return (
          <LoginPage
            onNavigateToRegister={() => setAuthView('register')}
            onLoginSuccess={handleLoginSuccess}
            onBack={() => setAuthView('welcome')}
          />
        );
      case 'register':
        return (
          <RegisterPage
            onNavigateToLogin={() => setAuthView('login')}
            onBack={() => setAuthView('welcome')}
          />
        );
      default:
        return (
          <WelcomePage
            onNavigateToLogin={() => setAuthView('login')}
            onNavigateToRegister={() => setAuthView('register')}
          />
        );
    }
  }

  const renderContent = () => {
    const authUser = authService.getAuthUser();
    const isAdmin = authUser?.role === 'Administrador';

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'create-form':
        return isAdmin ? <CreateForm /> : <Dashboard />;
      case 'my-forms':
        return isAdmin ? <MyForms /> : <Dashboard />;
      case 'responses':
        return <Responses />;
      case 'users':
        return isAdmin ? <Users /> : <Dashboard />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onLogout={handleLogout} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;