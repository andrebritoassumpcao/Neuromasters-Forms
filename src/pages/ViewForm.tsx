import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, FileText, ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import { apiService } from "../services/api";
import { QuestionnaireDetailDto } from "../types/questionnaire";

const ViewForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<QuestionnaireDetailDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadForm = async () => {
      try {
        if (id) {
          const data = await apiService.getForm(Number(id));
          setForm(data);
        }
      } catch (err) {
        console.error("❌ Erro ao carregar formulário", err);
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [id]);

  if (loading) {
    return <div className="p-6">Carregando questionário...</div>;
  }

  if (!form) {
    return <div className="p-6 text-red-600">Formulário não encontrado</div>;
  }

  const totalPerguntas = form.sections.reduce(
    (acc, s) => acc + s.questions.length,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Botão Voltar */}
        <div>
          <Button
            variant="outline"
            onClick={() => navigate("/forms")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {form.name}
          </h1>
          <p className="text-slate-600 mb-4">{form.description}</p>

          {/* Barra de Progresso (sempre 0 no preview) */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
              <span>Progresso</span>
              <span>0/{totalPerguntas} perguntas</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `0%` }}
              />
            </div>
          </div>
        </div>

        {/* Informações do Questionário */}
        <Card className="bg-white shadow-sm border-slate-200">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <div>
                <CardTitle className="text-lg text-slate-800">
                  {form.name}
                </CardTitle>
                <p className="text-sm text-slate-600 mt-1">
                  {totalPerguntas} perguntas • Visualização de administrador
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Seções e Perguntas */}
        <div className="space-y-6">
          {form.sections.map((section, sIndex) => (
            <div key={section.id} className="space-y-4">
              {/* Separador / título da seção */}
              <div className="flex items-center space-x-2 my-6">
                <div className="flex-1 border-t border-slate-300"></div>
                <h2 className="text-lg font-semibold text-slate-700">
                  {sIndex + 1}. {section.name}
                </h2>
                <div className="flex-1 border-t border-slate-300"></div>
              </div>

              {/* Perguntas da seção */}
              {section.questions.map((pergunta, qIndex) => (
                <Card
                  key={pergunta.id}
                  className="bg-white shadow-sm border-slate-200"
                >
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base text-slate-800 flex items-start space-x-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        {sIndex + 1}.{qIndex + 1}
                      </span>
                      <span className="flex-1">{pergunta.text}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Select disabled value="">
                      <SelectTrigger className="w-full max-w-xs">
                        <SelectValue placeholder="Pré-visualização (desabilitado)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
        </div>

        {/* Botão Enviar (desabilitado no preview) */}
        <div className="text-center pt-6">
          <Button
            disabled
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 text-lg"
          >
            <Send className="w-5 h-5 mr-2" />
            Enviar Respostas
          </Button>
          <p className="text-sm text-slate-500 mt-2">
            Este é apenas um preview do questionário
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewForm;
