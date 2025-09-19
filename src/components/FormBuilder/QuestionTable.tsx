import React from 'react';
import { Question, ResponseType } from '../../types';
import { Trash2, Plus, FileText } from 'lucide-react';

interface QuestionTableProps {
  questions: Question[];
  onUpdateQuestion: (index: number, field: string, value: any) => void;
  onDeleteQuestion: (index: number) => void;
  onAddQuestion: () => void;
}

const responseOptions: { value: ResponseType; label: string; color: string; bgColor: string }[] = [
  { value: 'A', label: 'A - Adquirido', color: 'text-green-800', bgColor: 'bg-green-500' },
  { value: 'P', label: 'P - Parcial/Induzido', color: 'text-yellow-800', bgColor: 'bg-yellow-500' },
  { value: 'N', label: 'N - Incapaz', color: 'text-red-800', bgColor: 'bg-red-500' },
  { value: 'X', label: 'X - Não se Aplica', color: 'text-gray-800', bgColor: 'bg-gray-500' },
];

const getResponseColor = (response?: ResponseType): string => {
  switch (response) {
    case 'A': return 'bg-green-500 text-white';
    case 'P': return 'bg-yellow-500 text-white';
    case 'N': return 'bg-red-500 text-white';
    case 'X': return 'bg-gray-500 text-white';
    default: return 'bg-white text-slate-700 border border-slate-300';
  }
};

const QuestionTable: React.FC<QuestionTableProps> = ({
  questions,
  onUpdateQuestion,
  onDeleteQuestion,
  onAddQuestion
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Perguntas do Formulário</h3>
          <button
            onClick={onAddQuestion}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Pergunta</span>
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[50px]">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[180px]">Grupo Habilidade</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[300px]">Pergunta</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[200px]">Observações</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[130px]">Observado</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[130px]">Relato Pais</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[130px]">Relato Prof.</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[130px]">Resposta Final</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[80px]">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {questions.map((question, index) => (
              <tr key={question.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-sm text-slate-600 font-medium">
                  {index + 1}
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={question.groupName}
                    onChange={(e) => onUpdateQuestion(index, 'groupName', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Comunicação Receptiva"
                  />
                </td>
                <td className="px-4 py-3">
                  <textarea
                    value={question.question}
                    onChange={(e) => onUpdateQuestion(index, 'question', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={2}
                    placeholder="Descreva a habilidade a ser avaliada..."
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={question.observations}
                    onChange={(e) => onUpdateQuestion(index, 'observations', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Observações..."
                  />
                </td>
                {['observedResponse', 'parentResponse', 'professionalResponse', 'finalResponse'].map((field) => (
                  <td key={field} className="px-4 py-3">
                    <select
                      value={question[field as keyof Question] as string || ''}
                      onChange={(e) => onUpdateQuestion(index, field, e.target.value as ResponseType)}
                      className={`w-full px-2 py-1 text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium ${getResponseColor(question[field as keyof Question] as ResponseType)}`}
                    >
                      <option value="" className="bg-white text-slate-700">Selecionar</option>
                      {responseOptions.map((option) => (
                        <option key={option.value} value={option.value} className="bg-white text-slate-700">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                ))}
                <td className="px-4 py-3">
                  <button
                    onClick={() => onDeleteQuestion(index)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir pergunta"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {questions.length === 0 && (
        <div className="p-12 text-center text-slate-500">
          <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">Nenhuma pergunta adicionada</h3>
          <p className="text-sm text-slate-500 mb-6">Clique em "Adicionar Pergunta" para começar a criar seu formulário.</p>
          <button
            onClick={onAddQuestion}
            className="flex items-center space-x-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Primeira Pergunta</span>
          </button>
        </div>
      )}

      {/* Response Legend */}
      {questions.length > 0 && (
        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <h4 className="text-sm font-medium text-slate-700 mb-3">Legenda de Respostas:</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {responseOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded ${option.bgColor}`}></div>
                <span className="text-sm text-slate-600">{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionTable;