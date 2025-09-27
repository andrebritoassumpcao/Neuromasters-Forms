import React, { useState, useEffect, useMemo } from "react";
import { Save, FileText } from "lucide-react";
import QuestionnaireBuilder from "../components/FormBuilder/QuestionnaireBuilder";
import { apiService } from "../services/api";
import {
  SkillGroupDto,
  CreateQuestionnaireRequest,
  QuestionnaireStatusEnum,
} from "../types/questionnaire";

// Types para estado local (UI) - representa as seções do formulário
interface Question {
  tempId: string; // ID temporário para controle da UI
  text: string; // mudou de 'question' para 'text'
  observations?: string;
  order: number;
}

interface SkillGroup {
  tempId: string; // ID temporário para controle da UI
  name: string;
  questions: Question[];
  isExpanded: boolean;
  order: number;
  skillGroupCode?: string; // referência opcional ao SkillGroup do catálogo
}

const CreateForm: React.FC = () => {
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allSkillGroups, setAllSkillGroups] = useState<SkillGroupDto[]>([]);

  // Calcular totais para preview (otimizado com useMemo)
  const totalQuestions = useMemo(
    () =>
      skillGroups.reduce((total, group) => total + group.questions.length, 0),
    [skillGroups]
  );

  const totalGroups = useMemo(
    () => skillGroups.filter((group) => group.name.trim()).length,
    [skillGroups]
  );

  // Carregar catálogo de SkillGroups disponíveis
  useEffect(() => {
    const loadSkillGroups = async () => {
      try {
        const groupsFromApi = await apiService.getSkillGroups();
        setAllSkillGroups(groupsFromApi);
      } catch (err) {
        console.error("Erro carregando grupos de habilidades:", err);
      }
    };

    loadSkillGroups();
  }, []);

  // Função para validar o formulário
  const validateForm = (): string | null => {
    if (!formName.trim()) {
      return "Por favor, insira um nome para o Questionário.";
    }
    if (skillGroups.length === 0 || totalQuestions === 0) {
      return "Por favor, adicione pelo menos uma seção com uma pergunta.";
    }
    if (skillGroups.some((g) => !g.name.trim())) {
      return "Nomeie todas as seções.";
    }
    if (skillGroups.some((g) => g.questions.some((q) => !q.text.trim()))) {
      return "Preencha todas as perguntas.";
    }
    return null;
  };

  // Função para construir o payload da API (mapear UI state -> DTO)
  const buildPayload = (): CreateQuestionnaireRequest => {
    return {
      name: formName,
      description: formDescription || undefined,
      status: QuestionnaireStatusEnum.Draft, // sempre começa como rascunho
      sections: skillGroups.map((group) => ({
        name: group.name,
        order: group.order,
        questions: group.questions.map((question) => ({
          text: question.text,
          observations: question.observations || undefined,
          order: question.order,
        })),
      })),
    };
  };

  // Função para resetar o formulário
  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setSkillGroups([]);
  };

  const handleSaveForm = async () => {
    // Validação
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsLoading(true);
    try {
      const payload = buildPayload();
      await apiService.createForm(payload);

      alert("Questionário salvo com sucesso!");
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar questionário:", error);
      alert("Erro ao salvar questionário. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Criar Questionário
          </h1>
          <p className="text-slate-600">
            Desenvolva um novo questionário de avaliação comportamental
          </p>
        </div>
        <button
          onClick={handleSaveForm}
          disabled={isLoading}
          type="button"
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-5 h-5" />
          <span>{isLoading ? "Salvando..." : "Salvar Questionário"}</span>
        </button>
      </div>

      {/* Configuração */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Configuração do Questionário
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="formName"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Nome do Questionário*
            </label>
            <input
              type="text"
              id="formName"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Avaliação de Comunicação Social"
            />
          </div>
          <div>
            <label
              htmlFor="formDescription"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Descrição (Opcional)
            </label>
            <input
              type="text"
              id="formDescription"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Breve descrição..."
            />
          </div>
        </div>
      </div>

      {/* Question Builder */}
      <QuestionnaireBuilder
        skillGroups={skillGroups}
        onUpdateSkillGroups={setSkillGroups}
        allSkillGroups={allSkillGroups}
      />

      {/* Preview */}
      {totalQuestions > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">
              Pré-visualização
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-slate-800">{formName}</h3>
                  <p className="text-sm text-slate-600">
                    {totalQuestions} pergunta(s) em {totalGroups} seção(ões)
                  </p>
                  {formDescription && (
                    <p className="text-sm text-slate-500 mt-1">
                      {formDescription}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">
                    Status: Rascunho
                  </p>
                </div>
              </div>

              {/* Lista de seções */}
              {skillGroups.map((group, i) => (
                <div
                  key={group.tempId}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <span className="text-sm font-medium text-slate-800">
                      {i + 1}. {group.name}
                    </span>
                    {group.skillGroupCode && (
                      <span className="text-xs text-blue-600 ml-2">
                        (baseado em: {group.skillGroupCode})
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded">
                    {group.questions.length} pergunta
                    {group.questions.length !== 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateForm;
