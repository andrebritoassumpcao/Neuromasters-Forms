import {
  RegisterRequest,
  LoginRequest,
  ApiResponse,
  RegisterResponse,
  LoginResponse,
  UserRoleResponse,
  AuthUser,
} from "../types/auth";

const API_BASE_URL = "http://localhost:5240/api/Auth";

class AuthService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API Error:", error);
      return {
        status: "Error",
        errorMessage: {
          code: "NETWORK_ERROR",
          message: "Erro de conexão com o servidor",
        },
      };
    }
  }

  // 🔹 Register mantém ApiResponse
  async register(
    userData: RegisterRequest
  ): Promise<ApiResponse<RegisterResponse>> {
    return this.request<RegisterResponse>("/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  // 🔹 Login retorna direto LoginResponse (sem ApiResponse)
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const url = `${API_BASE_URL}/login`;
    console.log("🔍 Chamando login:", url, credentials);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    console.log("🔍 Status response:", response.status);

    // Verifica se não retornou OK
    if (!response.ok) {
      const text = await response.text(); // tentar ler mesmo erro
      console.error("❌ Erro no login:", response.status, text);
      throw new Error("Email ou senha inválidos");
    }

    const json = await response.json();
    console.log("✅ JSON login recebido:", json);
    return json;
  }

  // 🔹 Busca role do usuário -> API ainda usa UseCaseResponse
  async getUserRole(userId: string): Promise<ApiResponse<UserRoleResponse>> {
    const token = this.getToken();
    return this.request<UserRoleResponse>(`/${userId}/role`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // 🔹 Local storage
  saveAuthData(loginResponse: LoginResponse, role: string): void {
    const authUser: AuthUser = {
      id: loginResponse.user.id,
      fullName: loginResponse.user.fullName,
      email: loginResponse.user.email,
      role: role as "Cliente" | "Administrador",
      token: loginResponse.token,
      expiration: loginResponse.expiration,
    };

    localStorage.setItem("authUser", JSON.stringify(authUser));
    localStorage.setItem("token", loginResponse.token);
    localStorage.setItem("tokenExpiration", loginResponse.expiration);
  }

  getAuthUser(): AuthUser | null {
    const authUserStr = localStorage.getItem("authUser");
    if (!authUserStr) return null;

    try {
      const authUser = JSON.parse(authUserStr);

      // Verificar expiração
      if (new Date(authUser.expiration) <= new Date()) {
        this.logout();
        return null;
      }

      return authUser;
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  isAuthenticated(): boolean {
    const authUser = this.getAuthUser();
    return authUser !== null;
  }

  hasRole(role: "Cliente" | "Administrador"): boolean {
    const authUser = this.getAuthUser();
    return authUser?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole("Administrador");
  }

  logout(): void {
    localStorage.removeItem("authUser");
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
  }
}

export const authService = new AuthService();
