import React, { useState } from "react";
import {
  Trash2,
  Plus,
  FileText,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

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

interface QuestionnaireBuilderProps {
  skillGroups: SkillGroup[];
  onUpdateSkillGroups: (groups: SkillGroup[]) => void;
}

const QuestionnaireBuilder: React.FC<QuestionnaireBuilderProps> = ({
  skillGroups,
  onUpdateSkillGroups,
}) => {
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Adicionar novo grupo de habilidades
  const addSkillGroup = () => {
    const newGroup: SkillGroup = {
      id: generateId(),
      name: "",
      questions: [],
      isExpanded: true,
    };
    onUpdateSkillGroups([...skillGroups, newGroup]);
  };

  // Atualizar nome do grupo
  const updateGroupName = (groupId: string, name: string) => {
    const updatedGroups = skillGroups.map((group) =>
      group.id === groupId ? { ...group, name } : group
    );
    onUpdateSkillGroups(updatedGroups);
  };

  // Deletar grupo
  const deleteGroup = (groupId: string) => {
    const updatedGroups = skillGroups.filter((group) => group.id !== groupId);
    onUpdateSkillGroups(updatedGroups);
  };

  // Toggle expansão do grupo
  const toggleGroupExpansion = (groupId: string) => {
    const updatedGroups = skillGroups.map((group) =>
      group.id === groupId ? { ...group, isExpanded: !group.isExpanded } : group
    );
    onUpdateSkillGroups(updatedGroups);
  };

  // Adicionar pergunta ao grupo
  const addQuestionToGroup = (groupId: string) => {
    const newQuestion: Question = {
      id: generateId(),
      question: "",
      observations: "",
    };

    const updatedGroups = skillGroups.map((group) =>
      group.id === groupId
        ? { ...group, questions: [...group.questions, newQuestion] }
        : group
    );
    onUpdateSkillGroups(updatedGroups);
  };

  // Atualizar pergunta
  const updateQuestion = (
    groupId: string,
    questionId: string,
    field: string,
    value: string
  ) => {
    const updatedGroups = skillGroups.map((group) =>
      group.id === groupId
        ? {
            ...group,
            questions: group.questions.map((q) =>
              q.id === questionId ? { ...q, [field]: value } : q
            ),
          }
        : group
    );
    onUpdateSkillGroups(updatedGroups);
  };

  // Deletar pergunta
  const deleteQuestion = (groupId: string, questionId: string) => {
    const updatedGroups = skillGroups.map((group) =>
      group.id === groupId
        ? {
            ...group,
            questions: group.questions.filter((q) => q.id !== questionId),
          }
        : group
    );
    onUpdateSkillGroups(updatedGroups);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">
            Construtor de Questionário
          </h3>
          <button
            onClick={addSkillGroup}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Grupo de Habilidades</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {skillGroups.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">
              Nenhum grupo criado
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Comece criando um grupo de habilidades para organizar suas
              perguntas.
            </p>
            <button
              onClick={addSkillGroup}
              className="flex items-center space-x-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Primeiro Grupo</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {skillGroups.map((group) => (
              <SkillGroupCard
                key={group.id}
                group={group}
                onUpdateGroupName={updateGroupName}
                onDeleteGroup={deleteGroup}
                onToggleExpansion={toggleGroupExpansion}
                onAddQuestion={addQuestionToGroup}
                onUpdateQuestion={updateQuestion}
                onDeleteQuestion={deleteQuestion}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente do Card do Grupo
interface SkillGroupCardProps {
  group: SkillGroup;
  onUpdateGroupName: (groupId: string, name: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onToggleExpansion: (groupId: string) => void;
  onAddQuestion: (groupId: string) => void;
  onUpdateQuestion: (
    groupId: string,
    questionId: string,
    field: string,
    value: string
  ) => void;
  onDeleteQuestion: (groupId: string, questionId: string) => void;
}

const SkillGroupCard: React.FC<SkillGroupCardProps> = ({
  group,
  onUpdateGroupName,
  onDeleteGroup,
  onToggleExpansion,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
}) => {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      {/* Group Header */}
      <div className="bg-slate-50 p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <button
              onClick={() => onToggleExpansion(group.id)}
              className="p-1 hover:bg-slate-200 rounded transition-colors"
            >
              {group.isExpanded ? (
                <ChevronDown className="w-4 h-4 text-slate-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-600" />
              )}
            </button>
            <input
              type="text"
              value={group.name}
              onChange={(e) => onUpdateGroupName(group.id, e.target.value)}
              className="flex-1 px-3 py-2 text-sm font-medium border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nome do Grupo de Habilidades (ex: Comunicação Receptiva)"
            />
            <span className="text-sm text-slate-500 bg-slate-200 px-2 py-1 rounded">
              {group.questions.length} pergunta
              {group.questions.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => onAddQuestion(group.id)}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Pergunta</span>
            </button>
            <button
              onClick={() => onDeleteGroup(group.id)}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
              title="Excluir grupo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Questions Table */}
      {group.isExpanded && (
        <div className="overflow-x-auto">
          {group.questions.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <p className="text-sm mb-4">Nenhuma pergunta neste grupo</p>
              <button
                onClick={() => onAddQuestion(group.id)}
                className="flex items-center space-x-2 mx-auto px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Primeira Pergunta</span>
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[50px]">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[300px]">
                    Pergunta
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[200px]">
                    Observações
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[80px]">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {group.questions.map((question, index) => (
                  <tr
                    key={question.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-slate-600 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <textarea
                        value={question.question}
                        onChange={(e) =>
                          onUpdateQuestion(
                            group.id,
                            question.id,
                            "question",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={2}
                        placeholder="Descreva a habilidade a ser avaliada..."
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={question.observations}
                        onChange={(e) =>
                          onUpdateQuestion(
                            group.id,
                            question.id,
                            "observations",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Observações..."
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onDeleteQuestion(group.id, question.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        title="Excluir pergunta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionnaireBuilder;
