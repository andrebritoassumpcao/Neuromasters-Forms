import React, { useState, useEffect, useMemo } from "react";
import { Save, FileText } from "lucide-react";
import QuestionnaireBuilder from "../components/FormBuilder/QuestionnaireBuilder";
import { apiService } from "../services/api";
import { UpdateQuestionnaireRequest } from "../types/questionnaire";
import {
  SkillGroupDto,
  QuestionnaireStatusEnum,
  QuestionnaireDetailDto,
  DefaultAnswerDto,
} from "../types/questionnaire";
import { useParams, useNavigate } from "react-router-dom";

interface Question {
  id?: number;
  tempId: string;
  text: string;
  observations?: string;
  order: number;
}

interface SkillGroup {
  id?: number;
  tempId: string;
  name: string;
  questions: Question[];
  isExpanded: boolean;
  order: number;
  skillGroupCode?: string;
}

const EditForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Estados principais
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allSkillGroups, setAllSkillGroups] = useState<SkillGroupDto[]>([]);
  const [loadingForm, setLoadingForm] = useState(true);

  // Estados das respostas padrão
  const [answerOptions, setAnswerOptions] = useState<DefaultAnswerDto[]>([]);
  const [newOptionText, setNewOptionText] = useState("");
  const [newOptionColor, setNewOptionColor] = useState("#3b82f6");

  // Totais calculados
  const totalQuestions = useMemo(
    () => skillGroups.reduce((total, g) => total + g.questions.length, 0),
    [skillGroups]
  );

  const totalGroups = useMemo(
    () => skillGroups.filter((g) => g.name.trim()).length,
    [skillGroups]
  );

  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      try {
        // Carregar catálogo de skill groups
        const groupsFromApi = await apiService.getSkillGroups();
        setAllSkillGroups(groupsFromApi);

        if (id) {
          // Carregar formulário existente
          const formData: QuestionnaireDetailDto = await apiService.getForm(
            Number(id)
          );
          setFormName(formData.name);
          setFormDescription(formData.description || "");

          // Mapear seções e perguntas
          const mappedGroups: SkillGroup[] = formData.sections.map(
            (s, idx) => ({
              id: s.id,
              tempId: `${s.name}-${idx}`,
              name: s.name,
              order: s.order,
              isExpanded: true,
              questions: s.questions.map((q, i) => ({
                id: q.id,
                tempId: `${q.text}-${i}`,
                text: q.text,
                observations: q.observations,
                order: q.order,
              })),
            })
          );
          setSkillGroups(mappedGroups);

          // Carregar respostas padrão existentes
          const defaultAnswers = await apiService.getDefaultAnswers(Number(id));
          setAnswerOptions(defaultAnswers);
        }
      } catch (err) {
        console.error("Erro carregando dados:", err);
        alert("Erro ao carregar formulário. Tente novamente.");
      } finally {
        setLoadingForm(false);
      }
    };

    loadData();
  }, [id]);

  // Funções para gerenciar respostas padrão
  const handleAddOption = () => {
    if (!newOptionText.trim()) return;

    const newOption: DefaultAnswerDto = {
      id: 0, // Será criado no backend
      questionnaireId: Number(id),
      label: newOptionText.trim(),
      color: newOptionColor,
    };

    setAnswerOptions((prev) => [...prev, newOption]);
    setNewOptionText("");
    setNewOptionColor("#3b82f6");
  };

  const handleRemoveOption = (idx: number) => {
    setAnswerOptions((prev) => prev.filter((_, i) => i !== idx));
  };

  // Validação do formulário
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

  // Construir payload para atualização
  const buildPayload = (): UpdateQuestionnaireRequest => ({
    id: Number(id),
    name: formName,
    description: formDescription || undefined,
    status: QuestionnaireStatusEnum.Draft,
    sections: skillGroups.map((group) => ({
      id: group.id ?? 0,
      name: group.name,
      order: group.order,
      questions: group.questions.map((q) => ({
        id: q.id ?? 0,
        text: q.text,
        observations: q.observations || undefined,
        order: q.order,
      })),
    })),
  });

  // Sincronizar respostas padrão
  const syncDefaultAnswers = async (questionnaireId: number) => {
    try {
      // Buscar respostas atuais no banco
      const currentAnswers = await apiService.getDefaultAnswers(
        questionnaireId
      );

      // Identificar respostas para deletar (existem no banco mas não no estado local)
      const answersToDelete = currentAnswers.filter(
        (current) => !answerOptions.some((local) => local.id === current.id)
      );

      // Identificar respostas para criar (não têm ID ou têm ID = 0)
      const answersToCreate = answerOptions.filter(
        (local) => !local.id || local.id === 0
      );

      // Deletar respostas removidas
      for (const answer of answersToDelete) {
        await apiService.deleteDefaultAnswer(answer.id);
      }

      // Criar novas respostas
      for (const answer of answersToCreate) {
        await apiService.createDefaultAnswer({
          questionnaireId,
          label: answer.label,
          color: answer.color,
        });
      }
    } catch (error) {
      console.error("Erro ao sincronizar respostas padrão:", error);
      throw error;
    }
  };

  // Salvar formulário
  const handleSaveForm = async () => {
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsLoading(true);
    try {
      // Atualizar questionário
      await apiService.updateForm(buildPayload());

      // Sincronizar respostas padrão
      await syncDefaultAnswers(Number(id));

      alert("Questionário atualizado com sucesso!");
      navigate("/forms");
    } catch (err) {
      console.error("Erro ao atualizar questionário:", err);
      alert("Erro ao atualizar questionário. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingForm) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-slate-600">Carregando formulário...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Editar Questionário
          </h1>
          <p className="text-slate-600">
            Atualize as informações do questionário de avaliação comportamental
          </p>
        </div>
        <button
          onClick={handleSaveForm}
          disabled={isLoading}
          type="button"
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-5 h-5" />
          <span>{isLoading ? "Salvando..." : "Atualizar Questionário"}</span>
        </button>
      </div>

      {/* Configuração do Questionário */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Configuração do Questionário
        </h2>

        {/* Nome e Descrição */}
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

        {/* Configuração das respostas padrão */}
        <div className="mt-8">
          <h3 className="text-md font-semibold text-slate-700 mb-3">
            Respostas Padrão
          </h3>

          <div className="flex items-center gap-3 mb-4">
            <input
              type="text"
              placeholder="Nome da resposta (ex: Sempre)"
              value={newOptionText}
              onChange={(e) => setNewOptionText(e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="color"
              value={newOptionColor}
              onChange={(e) => setNewOptionColor(e.target.value)}
              className="w-12 h-10 cursor-pointer border border-slate-300 rounded"
            />
            <button
              type="button"
              onClick={handleAddOption}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Adicionar
            </button>
          </div>

          {/* Lista das respostas criadas */}
          <div className="flex flex-wrap gap-3">
            {answerOptions.map((opt, idx) => (
              <div
                key={opt.id || idx}
                className="flex items-center gap-2 px-3 py-1 rounded-lg border border-slate-300"
                style={{ backgroundColor: opt.color + "20" }}
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: opt.color }}
                />
                <span className="font-medium text-slate-700">{opt.label}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveOption(idx)}
                  className="ml-2 text-slate-500 hover:text-red-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {answerOptions.length === 0 && (
            <p className="text-sm text-slate-500 italic">
              Nenhuma resposta padrão configurada. Adicione opções que serão
              aplicadas a todas as perguntas.
            </p>
          )}
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
                  {answerOptions.length > 0 && (
                    <p className="text-xs text-slate-400 mt-1">
                      {answerOptions.length} resposta(s) padrão configurada(s)
                    </p>
                  )}
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

export default EditForm;
