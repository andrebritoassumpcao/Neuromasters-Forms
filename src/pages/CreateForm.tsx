import React, { useState } from "react";
import { Save, FileText } from "lucide-react";
import QuestionnaireBuilder from "../components/FormBuilder/QuestionnaireBuilder";

// Types
interface Question {
  id: string;
  question: string;
  observations: string;
}

interface SkillGroup {
  id: string;
  name: string;
  questions: Question[];
  isExpanded: boolean;
}

const CreateForm: React.FC = () => {
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Calcular totais para preview
  const totalQuestions = skillGroups.reduce(
    (total, group) => total + group.questions.length,
    0
  );
  const totalGroups = skillGroups.filter((group) => group.name.trim()).length;

  const handleSaveForm = async () => {
    if (!formName.trim()) {
      alert("Por favor, insira um nome para o Questionário.");
      return;
    }

    if (skillGroups.length === 0 || totalQuestions === 0) {
      alert("Por favor, adicione pelo menos um grupo com uma pergunta.");
      return;
    }

    // Validar se todos os grupos têm nome
    const groupsWithoutName = skillGroups.filter((group) => !group.name.trim());
    if (groupsWithoutName.length > 0) {
      alert("Por favor, nomeie todos os grupos de habilidades.");
      return;
    }

    // Validar se todas as perguntas estão preenchidas
    const emptyQuestions = skillGroups.some((group) =>
      group.questions.some((q) => !q.question.trim())
    );
    if (emptyQuestions) {
      alert("Por favor, preencha todas as perguntas.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = {
        name: formName,
        description: formDescription,
        skillGroups: skillGroups,
        createdAt: new Date().toISOString(),
        status: "draft",
        // Converter para formato legado se necessário para API
        questions: skillGroups.flatMap((group) =>
          group.questions.map((q) => ({
            ...q,
            groupName: group.name,
          }))
        ),
      };

      // Simulated API call - replace with actual API call
      console.log("Saving form:", formData);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Formulário salvo com sucesso!");

      // Reset form
      setFormName("");
      setFormDescription("");
      setSkillGroups([]);
    } catch (error) {
      console.error("Error saving form:", error);
      alert("Erro ao salvar formulário. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
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
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-5 h-5" />
          <span>{isLoading ? "Salvando..." : "Salvar Questionário"}</span>
        </button>
      </div>

      {/* Form Configuration */}
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
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Breve descrição do questionário..."
            />
          </div>
        </div>
      </div>

      {/* Question Builder */}
      <QuestionnaireBuilder
        skillGroups={skillGroups}
        onUpdateSkillGroups={setSkillGroups}
      />

      {/* Form Preview */}
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
                  <h3 className="font-semibold text-slate-800">
                    {formName || "Nome do Questionário"}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {totalQuestions} pergunta(s) em {totalGroups} grupo(s) de
                    habilidades
                  </p>
                  {formDescription && (
                    <p className="text-sm text-slate-500 mt-1">
                      {formDescription}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-sm">
                  <span className="font-medium text-slate-700">
                    Total de perguntas:
                  </span>
                  <span className="ml-2 text-slate-600">{totalQuestions}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-slate-700">
                    Grupos de habilidades:
                  </span>
                  <span className="ml-2 text-slate-600">{totalGroups}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-slate-700">Status:</span>
                  <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                    Rascunho
                  </span>
                </div>
              </div>

              {/* Preview dos grupos */}
              {skillGroups.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">
                    Grupos configurados:
                  </h4>
                  <div className="space-y-2">
                    {skillGroups.map((group, index) => (
                      <div
                        key={group.id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                      >
                        <div>
                          <span className="text-sm font-medium text-slate-800">
                            {index + 1}. {group.name || "Grupo sem nome"}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded">
                          {group.questions.length} pergunta
                          {group.questions.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateForm;
