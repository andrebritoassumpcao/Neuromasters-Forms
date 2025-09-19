// API service for backend integration
import { authService } from "./authService";

const API_BASE_URL =
  process.env.VITE_API_BASE_URL || "https://localhost:7078/api";

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
    return this.request<any[]>("/forms");
  }

  async createForm(formData: any) {
    return this.request("/forms", {
      method: "POST",
      body: JSON.stringify(formData),
    });
  }

  async updateForm(id: string, formData: any) {
    return this.request(`/forms/${id}`, {
      method: "PUT",
      body: JSON.stringify(formData),
    });
  }

  async deleteForm(id: string) {
    return this.request(`/forms/${id}`, {
      method: "DELETE",
    });
  }

  // Responses endpoints
  async submitFormResponse(formId: string, responses: any) {
    return this.request(`/forms/${formId}/responses`, {
      method: "POST",
      body: JSON.stringify(responses),
    });
  }

  async getFormResponses(formId?: string) {
    const endpoint = formId ? `/forms/${formId}/responses` : "/responses";
    return this.request<any[]>(endpoint);
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
}

export const apiService = new ApiService();
