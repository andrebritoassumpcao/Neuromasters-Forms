import React, { useState, useEffect } from "react";
import { Menu } from "@headlessui/react";
import { MoreVertical } from "lucide-react";
import { FileText, Edit3, Eye, Search, Filter, Plus } from "lucide-react";
import { apiService } from "../services/api";
import {
  QuestionnaireDto,
  QuestionnaireListDto,
  QuestionnaireStatusEnum,
} from "../types/questionnaire";
import { useNavigate } from "react-router-dom";

const MyForms: React.FC = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState<QuestionnaireDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | QuestionnaireStatusEnum
  >("all");
  const [isLoading, setIsLoading] = useState(true);

  // Carregar do backend (listagem superficial)
  useEffect(() => {
    const loadForms = async () => {
      try {
        const result: QuestionnaireListDto = await apiService.getForms();
        setForms(result.questionnaires);
        setTotalCount(result.totalCount);
      } catch (err) {
        console.error("Erro ao carregar formulários:", err);
        // Em caso de erro, manter arrays vazios
        setForms([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadForms();
  }, []);

  // Filtro (aplicado no frontend - se quiser filtro no backend, mover para a API)
  const filteredForms = forms.filter((form) => {
    const matchesSearch = form.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || form.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Helpers de Status
  const getStatusColor = (status: QuestionnaireStatusEnum) => {
    switch (status) {
      case QuestionnaireStatusEnum.Published:
        return "bg-green-100 text-green-800 border-green-200";
      case QuestionnaireStatusEnum.Draft:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case QuestionnaireStatusEnum.Archived:
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusLabel = (status: QuestionnaireStatusEnum) => {
    switch (status) {
      case QuestionnaireStatusEnum.Published:
        return "Publicado";
      case QuestionnaireStatusEnum.Draft:
        return "Rascunho";
      case QuestionnaireStatusEnum.Archived:
        return "Arquivado";
      default:
        return status;
    }
  };

  // Ações
  const handleDeleteForm = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este formulário?")) {
      try {
        await apiService.deleteForm(id);
        // Atualizar o state local removendo o item
        setForms(forms.filter((form) => form.id !== id));
        setTotalCount(totalCount - 1);
      } catch (err) {
        console.error("Erro ao excluir formulário:", err);
        alert("Erro ao excluir formulário. Tente novamente.");
      }
    }
  };

  const handleDuplicateForm = async (form: QuestionnaireDto) => {
    try {
      // Aqui você pode implementar um endpoint específico para duplicar
      // Por enquanto, vamos simular localmente
      const newForm: QuestionnaireDto = {
        ...form,
        id: Math.floor(Math.random() * 100000), // mock ID
        name: `${form.name} (Cópia)`,
        createdAt: new Date().toISOString(),
        status: QuestionnaireStatusEnum.Draft,
      };

      // Adicionar ao início da lista
      setForms([newForm, ...forms]);
      setTotalCount(totalCount + 1);

      // TODO: Implementar apiService.duplicateForm(form.id) quando disponível
    } catch (err) {
      console.error("Erro ao duplicar formulário:", err);
      alert("Erro ao duplicar formulário. Tente novamente.");
    }
  };

  const handlePublishForm = async (id: number) => {
    try {
      await apiService.updateForm({
        id,
        status: QuestionnaireStatusEnum.Published,
      });
      setForms(
        forms.map((f) =>
          f.id === id ? { ...f, status: QuestionnaireStatusEnum.Published } : f
        )
      );
    } catch (err) {
      console.error("Erro ao publicar formulário:", err);
    }
  };

  const handleArchiveForm = async (id: number) => {
    try {
      await apiService.updateForm({
        id,
        status: QuestionnaireStatusEnum.Archived,
      });
      setForms(
        forms.map((f) =>
          f.id === id ? { ...f, status: QuestionnaireStatusEnum.Archived } : f
        )
      );
    } catch (err) {
      console.error("Erro ao arquivar formulário:", err);
    }
  };

  const handleViewForm = (id: number) => {
    navigate(`/forms/${id}/view`);
  };

  const handleEditForm = (id: number) => {
    navigate(`/forms/${id}/edit`);
  };
  const handleCreateNew = () => {
    // TODO: Navegar para página de criação
    console.log("Criar novo formulário");
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Meus Questionários
          </h1>
          <p className="text-slate-600">
            Gerencie seus questionários de avaliação comportamental
          </p>
          {totalCount > 0 && (
            <p className="text-sm text-slate-500 mt-1">
              Total: {totalCount} questionário(s)
            </p>
          )}
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Formulário</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* Busca */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar questionário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtro de status */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-600" />
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "all" | QuestionnaireStatusEnum
                  )
                }
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os Status</option>
                <option value={QuestionnaireStatusEnum.Draft}>Rascunho</option>
                <option value={QuestionnaireStatusEnum.Published}>
                  Publicado
                </option>
                <option value={QuestionnaireStatusEnum.Archived}>
                  Arquivado
                </option>
              </select>
            </div>
          </div>

          <div className="text-sm text-slate-600">
            {filteredForms.length} de {totalCount} formulário(s)
          </div>
        </div>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredForms.map((form) => (
          <div
            key={form.id}
            className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-2">
                    {form.name}
                  </h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                        form.status
                      )}`}
                    >
                      {getStatusLabel(form.status)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Criado em{" "}
                    {new Date(form.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                  {form.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {form.description}
                    </p>
                  )}
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>

              {/* 🔹 Ações */}
              <div className="flex items-center justify-end pt-4 border-t border-slate-200">
                <div className="flex items-center space-x-2">
                  {/* Botões primários */}
                  <button
                    onClick={() => handleViewForm(form.id)}
                    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Visualizar"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditForm(form.id)}
                    className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Menu secundário */}
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg">
                      <MoreVertical className="w-5 h-5" />
                    </Menu.Button>

                    <Menu.Items className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-20 focus:outline-none">
                      {/* Duplicar */}
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => handleDuplicateForm(form)}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              active ? "bg-slate-100 text-purple-600" : ""
                            }`}
                          >
                            Duplicar
                          </button>
                        )}
                      </Menu.Item>

                      {/* Publicar se Draft */}
                      {form.status === QuestionnaireStatusEnum.Draft && (
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handlePublishForm(form.id)}
                              className={`block w-full text-left px-4 py-2 text-sm ${
                                active ? "bg-slate-100 text-indigo-600" : ""
                              }`}
                            >
                              Publicar
                            </button>
                          )}
                        </Menu.Item>
                      )}

                      {/* Arquivar se Published */}
                      {form.status === QuestionnaireStatusEnum.Published && (
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleArchiveForm(form.id)}
                              className={`block w-full text-left px-4 py-2 text-sm ${
                                active ? "bg-slate-100 text-orange-600" : ""
                              }`}
                            >
                              Arquivar
                            </button>
                          )}
                        </Menu.Item>
                      )}

                      {/* Excluir apenas se Draft */}
                      {form.status === QuestionnaireStatusEnum.Draft && (
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleDeleteForm(form.id)}
                              className={`block w-full text-left px-4 py-2 text-sm text-red-600 ${
                                active ? "bg-red-50" : ""
                              }`}
                            >
                              Excluir
                            </button>
                          )}
                        </Menu.Item>
                      )}
                    </Menu.Items>
                  </Menu>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredForms.length === 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">
            {searchTerm || statusFilter !== "all"
              ? "Nenhum formulário encontrado"
              : "Nenhum formulário criado"}
          </h3>
          <p className="text-slate-500 mb-6">
            {searchTerm || statusFilter !== "all"
              ? "Tente ajustar os filtros de busca"
              : "Comece criando seu primeiro formulário de avaliação"}
          </p>
          {!searchTerm && statusFilter === "all" && (
            <button
              onClick={handleCreateNew}
              className="flex items-center space-x-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
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
