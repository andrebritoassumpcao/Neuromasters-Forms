import React from 'react';
import { 
  FileText, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Activity,
  CheckCircle,
  Clock
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { 
      title: 'Total de Formulários', 
      value: '24', 
      change: '+12%', 
      icon: FileText, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'Respostas Recebidas', 
      value: '156', 
      change: '+8%', 
      icon: MessageSquare, 
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      title: 'Usuários Ativos', 
      value: '32', 
      change: '+5%', 
      icon: Users, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      title: 'Taxa de Conclusão', 
      value: '89%', 
      change: '+3%', 
      icon: TrendingUp, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
  ];

  const recentForms = [
    { name: 'Avaliação Comunicação Social', responses: 12, status: 'active', date: '2025-01-15' },
    { name: 'Comportamento Adaptativo', responses: 8, status: 'draft', date: '2025-01-14' },
    { name: 'Habilidades Motoras', responses: 15, status: 'completed', date: '2025-01-13' },
    { name: 'Interação Social', responses: 6, status: 'active', date: '2025-01-12' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="w-4 h-4" />;
      case 'draft': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-600">Visão geral do sistema de avaliação comportamental</p>
        </div>
        <div className="text-sm text-slate-500">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} vs último mês</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Forms */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">Formulários Recentes</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentForms.map((form, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${getStatusColor(form.status)}`}>
                      {getStatusIcon(form.status)}
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-800">{form.name}</h3>
                      <p className="text-sm text-slate-500">{form.responses} respostas • {form.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(form.status)}`}>
                      {form.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">Ações Rápidas</h2>
          </div>
          <div className="p-6 space-y-4">
            <button className="w-full flex items-center space-x-3 p-4 text-left border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-blue-300 transition-all">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-800">Criar Formulário</h3>
                <p className="text-sm text-slate-500">Novo formulário de avaliação</p>
              </div>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-4 text-left border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-green-300 transition-all">
              <div className="p-2 bg-green-50 rounded-lg">
                <MessageSquare className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-800">Ver Respostas</h3>
                <p className="text-sm text-slate-500">Analisar dados coletados</p>
              </div>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-4 text-left border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-purple-300 transition-all">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-800">Gerenciar Usuários</h3>
                <p className="text-sm text-slate-500">Adicionar profissionais</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Formulários Aplicados por Mês</h2>
        </div>
        <div className="p-6">
          <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-600">Gráfico de Análise</p>
              <p className="text-sm text-slate-500">Dados de formulários aplicados ao longo do tempo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;