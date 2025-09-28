import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { authService } from "./services/authService";
import WelcomePage from "./pages/auth/WelcomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import Sidebar from "./components/Layout/Sidebar";
import Topbar from "./components/Layout/Topbar";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<"welcome" | "login" | "register">(
    "welcome"
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => setIsAuthenticated(true);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthView("welcome");
    authService.logout?.(); // se tiver um método de logout real
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    switch (authView) {
      case "login":
        return (
          <LoginPage
            onNavigateToRegister={() => setAuthView("register")}
            onLoginSuccess={handleLoginSuccess}
            onBack={() => setAuthView("welcome")}
          />
        );
      case "register":
        return (
          <RegisterPage
            onNavigateToLogin={() => setAuthView("login")}
            onBack={() => setAuthView("welcome")}
          />
        );
      default:
        return (
          <WelcomePage
            onNavigateToLogin={() => setAuthView("login")}
            onNavigateToRegister={() => setAuthView("register")}
          />
        );
    }
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex">
        {/* Sidebar fixa */}
        <Sidebar />

        {/* Main layout */}
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar onLogout={handleLogout} />
          <main className="flex-1 overflow-auto">
            <AppRoutes />
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
