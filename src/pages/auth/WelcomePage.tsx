import React from "react";
import { FileText, Users, BarChart3, Shield, ArrowRight } from "lucide-react";

interface WelcomePageProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({
  onNavigateToLogin,
  onNavigateToRegister,
}) => {
  const features = [
    {
      icon: FileText,
      title: "Questionários Personalizados",
      description:
        "Crie questionários de avaliação comportamental adaptados às suas necessidades",
    },
    {
      icon: Users,
      title: "Gestão de Usuários",
      description:
        "Gerencie profissionais, administradores e responsáveis em um só lugar",
    },
    {
      icon: BarChart3,
      title: "Análise de Dados",
      description:
        "Visualize e exporte relatórios detalhados das avaliações realizadas",
    },
    {
      icon: Shield,
      title: "Segurança Avançada",
      description:
        "Sistema seguro com autenticação JWT e controle de acesso por roles",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  TEA Assessment
                </h1>
                <p className="text-xs text-slate-600">
                  Sistema de Avaliação Comportamental
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={onNavigateToLogin}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
              >
                Entrar
              </button>
              <button
                onClick={onNavigateToRegister}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Criar Conta
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
            Sistema de Avaliação
            <span className="text-blue-600 block">Comportamental TEA</span>
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Plataforma completa para criação, aplicação e análise de
            questionários de avaliação comportamental voltados para o Transtorno
            do Espectro Autista.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onNavigateToRegister}
              className="flex items-center justify-center space-x-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors text-lg"
            >
              <span>Começar Agora</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onNavigateToLogin}
              className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 hover:bg-slate-50 font-medium transition-colors text-lg"
            >
              Já tenho conta
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">
              Funcionalidades Principais
            </h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Tudo que você precisa para realizar avaliações comportamentais de
              forma eficiente e profissional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-800 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-slate-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Pronto para começar?</h3>
            <p className="text-xl mb-8 opacity-90">
              Crie sua conta gratuita e comece a usar o sistema hoje mesmo.
            </p>
            <button
              onClick={onNavigateToRegister}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-50 font-medium transition-colors text-lg"
            >
              Criar Conta Gratuita
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold">TEA Assessment</h4>
                <p className="text-sm text-slate-400">
                  Sistema de Avaliação Comportamental
                </p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-slate-400 text-sm">
                © 2025 TEA Assessment System. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
