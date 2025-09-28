// API service for backend integration
import {
  SkillGroupDto,
  QuestionnaireDetailDto,
  QuestionnaireListDto,
  CreateQuestionnaireRequest,
  UpdateQuestionnaireRequest,
  CreateDefaultAnswerRequest,
  DefaultAnswerDto,
} from "../types/questionnaire";
import { authService } from "./authService";

const API_BASE_URL = "http://localhost:5240/api";

class ApiService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = authService.getToken();
    console.log("API_BASE_URL: tá batendo?", API_BASE_URL);
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        authService.logout();
        window.location.reload();
      }
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Forms endpoints
  async getForms() {
    return this.request<QuestionnaireListDto>("/questionnaire/list-forms");
  }

  async createForm(formData: CreateQuestionnaireRequest) {
    return this.request<QuestionnaireDetailDto>("/questionnaire/create-form", {
      method: "POST",
      body: JSON.stringify(formData),
    });
  }

  async getForm(id: number) {
    return this.request<QuestionnaireDetailDto>(
      `/questionnaire/get-form/${id}`
    );
  }

  async updateForm(formData: UpdateQuestionnaireRequest) {
    return this.request<QuestionnaireDetailDto>("/questionnaire/update-form", {
      method: "PUT",
      body: JSON.stringify(formData),
    });
  }

  async deleteForm(id: number) {
    return this.request<boolean>(`/questionnaire/delete-form/${id}`, {
      method: "DELETE",
    });
  }
  // Default Answers endpoints
  async getDefaultAnswers(questionnaireId: number) {
    return this.request<DefaultAnswerDto[]>(
      `/questionnaire/list-default-answers/${questionnaireId}`
    );
  }

  async createDefaultAnswer(answerData: CreateDefaultAnswerRequest) {
    return this.request<DefaultAnswerDto>(
      "/questionnaire/create-default-answer",
      {
        method: "POST",
        body: JSON.stringify(answerData),
      }
    );
  }

  async getDefaultAnswer(id: number) {
    return this.request<DefaultAnswerDto>(
      `/questionnaire/get-default-answer/${id}`
    );
  }

  async deleteDefaultAnswer(id: number) {
    return this.request<boolean>(`/questionnaire/delete-default-answer/${id}`, {
      method: "DELETE",
    });
  }
  // Users endpoints
  async getUsers() {
    return this.request<any[]>("/users");
  }

  async createUser(userData: any) {
    return this.request("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  // Dashboard stats
  async getDashboardStats() {
    return this.request<any>("/dashboard/stats");
  }

  // 🔹 SKILL GROUPS - Ajustados para os endpoints corretos
  async getSkillGroups(): Promise<SkillGroupDto[]> {
    const response = await this.request<{ skillGroups: SkillGroupDto[] }>(
      "/questionnaire/list-groups"
    );
    return response.skillGroups;
  }

  async createSkillGroup(data: { code: string; description: string }) {
    return this.request("/questionnaire/create-groups", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getSkillGroup(code: string) {
    return this.request(`/questionnaire/get-group/${code}`);
  }

  async updateSkillGroup(data: { code: string; description: string }) {
    return this.request("/questionnaire/update-groups", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteSkillGroup(code: string) {
    return this.request(`/questionnaire/delete-group/${code}`, {
      method: "DELETE",
    });
  }

  // 🔹 NOVOS ENDPOINTS - Competências/Habilidades
  async getCompetenciasByGroup(groupCode: string) {
    return this.request<any[]>(`/grupos-habilidades/${groupCode}/competencias`);
  }

  async createCompetencia(
    groupCode: string,
    data: { descricao: string; sequencia: number }
  ) {
    return this.request(`/grupos-habilidades/${groupCode}/competencias`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCompetencia(
    competenciaId: number,
    data: { descricao: string; sequencia?: number }
  ) {
    return this.request(`/competencias/${competenciaId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteCompetencia(competenciaId: number) {
    return this.request(`/competencias/${competenciaId}`, {
      method: "DELETE",
    });
  }

  // 🔹 NOVOS ENDPOINTS - Graus de Competência
  async getGrausCompetencia() {
    return this.request<any[]>("/graus-competencia");
  }

  async createGrauCompetencia(data: { codigo: number; descricao: string }) {
    return this.request("/graus-competencia", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateGrauCompetencia(codigo: number, data: { descricao: string }) {
    return this.request(`/graus-competencia/${codigo}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteGrauCompetencia(codigo: number) {
    return this.request(`/graus-competencia/${codigo}`, {
      method: "DELETE",
    });
  }
}

export const apiService = new ApiService();
