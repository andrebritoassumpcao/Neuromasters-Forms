import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ArrowLeft,
  FileText,
  Phone,
} from "lucide-react";
import { authService } from "../../services/authService";
import { RegisterRequest } from "../../types/auth";

interface RegisterPageProps {
  onNavigateToLogin: () => void;
  onBack: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({
  onNavigateToLogin,
  onBack,
}) => {
  const [formData, setFormData] = useState<RegisterRequest>({
    fullName: "",
    email: "",
    password: "",
    documentNumber: "",
    phoneNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  // --- FORMATADORES SIMPLES ---
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6)
      return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9)
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(
        6
      )}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(
      6,
      9
    )}-${numbers.slice(9, 11)}`;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
      7,
      11
    )}`;
  };

  // Validação simples: só conta os dígitos
  const validateCPF = (cpf: string): boolean =>
    cpf.replace(/\D/g, "").length === 11;

  // --- HANDLERS ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === "documentNumber") processedValue = formatCPF(value);
    if (name === "phoneNumber") processedValue = formatPhone(value);

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
    setError("");
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim())
      return setError("Nome completo é obrigatório"), false;
    if (!formData.email.trim()) return setError("Email é obrigatório"), false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return setError("Email inválido"), false;
    if (!validateCPF(formData.documentNumber))
      return setError("CPF deve ter 11 dígitos"), false;
    if (formData.phoneNumber.replace(/\D/g, "").length < 10)
      return setError("Telefone deve ter pelo menos 10 dígitos"), false;
    if (!formData.password) return setError("Senha é obrigatória"), false;
    if (formData.password.length < 6)
      return setError("Senha deve ter pelo menos 6 caracteres"), false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const requestData = {
        ...formData,
        documentNumber: formData.documentNumber.replace(/\D/g, ""),
        phoneNumber: formData.phoneNumber.replace(/\D/g, ""),
      };

      const response = await authService.register(requestData);

      // como o back retorna objeto direto (RegisterResponse)
      if (response && response.id) {
        setSuccess(true);
        setTimeout(() => onNavigateToLogin(), 2000);
      } else {
        setError("Erro ao criar conta. Tente novamente.");
      }
    } catch (err: any) {
      setError(
        err.message ??
          "Erro de conexão. Verifique sua internet e tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- UI de sucesso ---
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Conta Criada!
          </h2>
          <p className="text-slate-600 mb-4">
            Sua conta foi criada com sucesso. Redirecionando para o login...
          </p>
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // --- FORM PRINCIPAL ---
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
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Criar Conta</h1>
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

          <InputField
            icon={User}
            id="fullName"
            label="Nome Completo"
            value={formData.fullName}
            onChange={handleInputChange}
            disabled={isLoading}
            placeholder="Digite seu nome completo"
          />
          <InputField
            icon={FileText}
            id="documentNumber"
            label="CPF"
            value={formData.documentNumber}
            onChange={handleInputChange}
            disabled={isLoading}
            placeholder="000.000.000-00"
            maxLength={14}
          />
          <InputField
            icon={Phone}
            id="phoneNumber"
            label="Telefone"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            disabled={isLoading}
            placeholder="(11) 99999-9999"
            maxLength={15}
          />
          <InputField
            icon={Mail}
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoading}
            placeholder="Digite seu email"
          />

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Senha
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Mínimo de 6 caracteres
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Criando conta...</span>
              </div>
            ) : (
              "Criar Conta"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-600">
            Já tem uma conta?{" "}
            <button
              onClick={onNavigateToLogin}
              className="text-blue-600 hover:text-blue-700 font-medium"
              disabled={isLoading}
            >
              Fazer login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// 🔹 InputField simplificado para reduzir repetição
const InputField = ({ icon: Icon, id, label, ...props }: any) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-slate-700 mb-2"
    >
      {label}
    </label>
    <div className="relative">
      <Icon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        id={id}
        name={id}
        {...props}
        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  </div>
);

export default RegisterPage;
