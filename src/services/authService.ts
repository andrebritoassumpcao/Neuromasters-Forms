import {
  RegisterRequest,
  LoginRequest,
  RegisterResponse,
  LoginResponse,
  UserRoleResponse,
  AuthUser,
} from "../types/auth";

const API_BASE_URL = "http://localhost:5240/api";

class AuthService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Erro na requisição [${response.status}]: ${
          text || response.statusText
        }`
      );
    }

    return (await response.json()) as T;
  }

  // 🔹 Register retorna RegisterResponse simples
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    return this.request<RegisterResponse>("/Auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  // 🔹 Login retorna LoginResponse simples
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>("/Auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  // 🔹 Get user role retorna UserRoleResponse simples
  async getUserRole(userId: string): Promise<UserRoleResponse> {
    const token = this.getToken();
    return this.request<UserRoleResponse>(`/Roles/${userId}/user-role`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // 🔹 Local storage management
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
      const authUser: AuthUser = JSON.parse(authUserStr);

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
    return this.getAuthUser() !== null;
  }

  hasRole(role: "Cliente" | "Administrador"): boolean {
    return this.getAuthUser()?.role === role;
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
