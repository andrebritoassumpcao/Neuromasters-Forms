import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Edit3, 
  Trash2, 
  Eye, 
  Copy,
  Search,
  Filter,
  Plus
} from 'lucide-react';
import { FormData } from '../types';

const MyForms: React.FC = () => {
  const [forms, setForms] = useState<FormData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const mockForms: FormData[] = [
      {
        id: '1',
        name: 'Avaliação de Comunicação Social',
        createdAt: '2025-01-15T10:00:00Z',
        status: 'published',
        questions: []
      },
      {
        id: '2', 
        name: 'Comportamento Adaptativo',
        createdAt: '2025-01-14T15:30:00Z',
        status: 'draft',
        questions: []
      },
      {
        id: '3',
        name: 'Habilidades Motoras Finas',
        createdAt: '2025-01-13T09:15:00Z',
        status: 'completed',
        questions: []
      },
      {
        id: '4',
        name: 'Interação Social e Brincadeira',
        createdAt: '2025-01-12T14:20:00Z',
        status: 'published',
        questions: []
      }
    ];

    setTimeout(() => {
      setForms(mockForms);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || form.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Publicado';
      case 'draft': return 'Rascunho';
      case 'completed': return 'Concluído';
      default: return status;
    }
  };

  const handleDeleteForm = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este formulário?')) {
      setForms(forms.filter(form => form.id !== id));
    }
  };

  const handleDuplicateForm = (form: FormData) => {
    const newForm: FormData = {
      ...form,
      id: Math.random().toString(36).substr(2, 9),
      name: `${form.name} (Cópia)`,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    setForms([newForm, ...forms]);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Meus Formulários</h1>
          <p className="text-slate-600">Gerencie seus formulários de avaliação comportamental</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Novo Formulário</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar formulários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os Status</option>
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
                <option value="completed">Concluído</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-slate-600">
            {filteredForms.length} formulário(s) encontrado(s)
          </div>
        </div>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredForms.map((form) => (
          <div key={form.id} className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-2">
                    {form.name}
                  </h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(form.status)}`}>
                      {getStatusLabel(form.status)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Criado em {new Date(form.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="text-sm text-slate-500">
                  {form.questions?.length || 0} pergunta(s)
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Visualizar"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDuplicateForm(form)}
                    className="p-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Duplicar"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteForm(form.id)}
                    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredForms.length === 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">
            {searchTerm || statusFilter !== 'all' ? 'Nenhum formulário encontrado' : 'Nenhum formulário criado'}
          </h3>
          <p className="text-slate-500 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Tente ajustar os filtros de busca'
              : 'Comece criando seu primeiro formulário de avaliação'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button className="flex items-center space-x-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Criar Primeiro Formulário</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MyForms;