import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react";
import { authService } from "../../services/authService";
import { LoginRequest } from "../../types/auth";

interface LoginPageProps {
  onNavigateToRegister: () => void;
  onLoginSuccess: () => void;
  onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateToRegister,
  onLoginSuccess,
  onBack,
}) => {
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setError("Email é obrigatório");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Email inválido");
      return false;
    }
    if (!formData.password) {
      setError("Senha é obrigatória");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const loginResponse = await authService.login(formData);

      const roleResponse = await authService.getUserRole(loginResponse.user.id);

      if (roleResponse && roleResponse.roleName) {
        authService.saveAuthData(loginResponse, roleResponse.roleName);
      } else {
        authService.saveAuthData(loginResponse, "Cliente");
      }

      onLoginSuccess();
    } catch (error: any) {
      setError(error.message ?? "Email ou senha inválidos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <LogIn className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Entrar</h1>
              <p className="text-slate-600 text-sm">Sistema TEA Assessment</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite seu email"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Senha
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite sua senha"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-slate-600">
                Lembrar de mim
              </span>
            </label>
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700"
              disabled={isLoading}
            >
              Esqueceu a senha?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Entrando...</span>
              </div>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-600">
            Não tem uma conta?{" "}
            <button
              onClick={onNavigateToRegister}
              className="text-blue-600 hover:text-blue-700 font-medium"
              disabled={isLoading}
            >
              Criar conta
            </button>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="text-center">
            <p className="text-xs text-slate-500">
              Sistema de Avaliação Comportamental TEA
            </p>
            <p className="text-xs text-slate-400 mt-1">
              © 2025 - Todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
