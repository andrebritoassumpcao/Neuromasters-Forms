import React, { useState } from 'react';
import { Question } from '../types';
import QuestionTable from '../components/FormBuilder/QuestionTable';
import { Save, FileText } from 'lucide-react';

const CreateForm: React.FC = () => {
  const [formName, setFormName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: generateId(),
      groupName: '',
      question: '',
      observations: '',
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updatedQuestions = [...questions];
    (updatedQuestions[index] as any)[field] = value;
    setQuestions(updatedQuestions);
  };

  const deleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSaveForm = async () => {
    if (!formName.trim()) {
      alert('Por favor, insira um nome para o formulário.');
      return;
    }

    if (questions.length === 0) {
      alert('Por favor, adicione pelo menos uma pergunta.');
      return;
    }

    setIsLoading(true);
    
    try {
      const formData = {
        name: formName,
        questions: questions,
        createdAt: new Date().toISOString(),
        status: 'draft'
      };

      // Simulated API call - replace with actual API call
      console.log('Saving form:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Formulário salvo com sucesso!');
      
      // Reset form
      setFormName('');
      setQuestions([]);
      
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Erro ao salvar formulário. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Criar Formulário</h1>
          <p className="text-slate-600">Desenvolva um novo formulário de avaliação comportamental</p>
        </div>
        <button
          onClick={handleSaveForm}
          disabled={isLoading}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-5 h-5" />
          <span>{isLoading ? 'Salvando...' : 'Salvar Formulário'}</span>
        </button>
      </div>

      {/* Form Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Configuração do Formulário</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label htmlFor="formName" className="block text-sm font-medium text-slate-700 mb-2">
              Nome do Formulário *
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
            <label htmlFor="formDescription" className="block text-sm font-medium text-slate-700 mb-2">
              Descrição (Opcional)
            </label>
            <input
              type="text"
              id="formDescription"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Breve descrição do formulário..."
            />
          </div>
        </div>
      </div>

      {/* Question Builder */}
      <QuestionTable
        questions={questions}
        onUpdateQuestion={updateQuestion}
        onDeleteQuestion={deleteQuestion}
        onAddQuestion={addQuestion}
      />

      {/* Form Preview */}
      {questions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">Pré-visualização</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-slate-800">{formName || 'Nome do Formulário'}</h3>
                  <p className="text-sm text-slate-600">{questions.length} pergunta(s) configurada(s)</p>
                </div>
              </div>
              <div className="text-sm text-slate-500">
                <p><strong>Total de perguntas:</strong> {questions.length}</p>
                <p><strong>Grupos de habilidades únicos:</strong> {new Set(questions.map(q => q.groupName).filter(g => g)).size}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateForm;