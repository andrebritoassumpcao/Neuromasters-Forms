import React, { useState, useEffect } from "react";
import {
  Download,
  Search,
  Filter,
  Eye,
  Calendar,
  User,
  FileText,
  BarChart3,
} from "lucide-react";
import { FormResponse } from "../types";

const Responses: React.FC = () => {
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedForm, setSelectedForm] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const mockResponses: FormResponse[] = [
      {
        id: "1",
        formId: "1",
        formName: "Avaliação de Comunicação Social",
        respondentName: "Ana Silva",
        submittedAt: "2025-01-15T14:30:00Z",
        responses: {
          q1: "A",
          q2: "P",
          q3: "N",
          q4: "X",
          q5: "A",
        },
      },
      {
        id: "2",
        formId: "1",
        formName: "Avaliação de Comunicação Social",
        respondentName: "João Santos",
        submittedAt: "2025-01-14T16:45:00Z",
        responses: {
          q1: "P",
          q2: "A",
          q3: "P",
          q4: "A",
          q5: "N",
        },
      },
      {
        id: "3",
        formId: "2",
        formName: "Comportamento Adaptativo",
        respondentName: "Maria Oliveira",
        submittedAt: "2025-01-13T11:20:00Z",
        responses: {
          q1: "A",
          q2: "A",
          q3: "P",
          q4: "A",
        },
      },
    ];

    setTimeout(() => {
      setResponses(mockResponses);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredResponses = responses.filter((response) => {
    const matchesSearch =
      response.respondentName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      response.formName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesForm =
      selectedForm === "all" || response.formId === selectedForm;
    return matchesSearch && matchesForm;
  });

  const uniqueForms = Array.from(new Set(responses.map((r) => r.formId)))
    .map((formId) => responses.find((r) => r.formId === formId))
    .filter(Boolean) as FormResponse[];

  const getResponseColor = (response: string) => {
    switch (response) {
      case "A":
        return "bg-green-500";
      case "P":
        return "bg-yellow-500";
      case "N":
        return "bg-red-500";
      case "X":
        return "bg-gray-500";
      default:
        return "bg-gray-300";
    }
  };

  const getResponseLabel = (response: string) => {
    switch (response) {
      case "A":
        return "Adquirido";
      case "P":
        return "Parcial/Induzido";
      case "N":
        return "Incapaz";
      case "X":
        return "Não se Aplica";
      default:
        return response;
    }
  };

  const handleExportCSV = () => {
    const headers = ["Data", "Formulário", "Respondente", "Respostas"];
    const csvData = filteredResponses.map((response) => [
      new Date(response.submittedAt).toLocaleDateString("pt-BR"),
      response.formName,
      response.respondentName,
      Object.values(response.responses).join(", "),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "respostas_formularios.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const calculateStats = () => {
    const totalResponses = filteredResponses.length;
    const responsesByForm = filteredResponses.reduce((acc, response) => {
      acc[response.formName] = (acc[response.formName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const allResponseValues = filteredResponses.flatMap((r) =>
      Object.values(r.responses)
    );
    const responseDistribution = allResponseValues.reduce((acc, response) => {
      acc[response] = (acc[response] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { totalResponses, responsesByForm, responseDistribution };
  };

  const stats = calculateStats();

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Respostas</h1>
          <p className="text-slate-600">
            Visualize e analise as respostas dos questionários
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Exportar CSV</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Total de Respostas
              </p>
              <p className="text-2xl font-bold text-slate-800">
                {stats.totalResponses}
              </p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {Object.entries(stats.responseDistribution).map(([response, count]) => (
          <div
            key={response}
            className="bg-white p-6 rounded-lg border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  {getResponseLabel(response)}
                </p>
                <p className="text-2xl font-bold text-slate-800">{count}</p>
              </div>
              <div
                className={`w-8 h-8 rounded-full ${getResponseColor(response)}`}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por respondente ou formulário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-600" />
              <select
                value={selectedForm}
                onChange={(e) => setSelectedForm(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os Questionários</option>
                {uniqueForms.map((form) => (
                  <option key={form.formId} value={form.formId}>
                    {form.formName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-sm text-slate-600">
            {filteredResponses.length} resposta(s) encontrada(s)
          </div>
        </div>
      </div>

      {/* Responses Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Respondente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Formulário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Data de Envio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Respostas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredResponses.map((response) => (
                <tr key={response.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 bg-slate-100 rounded-full mr-3">
                        <User className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {response.respondentName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">
                      {response.formName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-slate-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(response.submittedAt).toLocaleDateString(
                        "pt-BR"
                      )}{" "}
                      às{" "}
                      {new Date(response.submittedAt).toLocaleTimeString(
                        "pt-BR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      {Object.values(response.responses).map((resp, index) => (
                        <div
                          key={index}
                          className={`w-6 h-6 rounded-full ${getResponseColor(
                            resp
                          )} flex items-center justify-center text-white text-xs font-bold`}
                          title={getResponseLabel(resp)}
                        >
                          {resp}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <BarChart3 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredResponses.length === 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">
            Nenhuma resposta encontrada
          </h3>
          <p className="text-slate-500">
            {searchTerm || selectedForm !== "all"
              ? "Tente ajustar os filtros de busca"
              : "As respostas aparecerão aqui quando os questionários forem respondidos"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Responses;
