export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  documentNumber: string;
  phoneNumber: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  fullName: string;
  email: string;
}

export interface UserDto {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  emailConfirmed: boolean;
  phoneNumberConfirmed: boolean;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  expiration: string;
  user: UserDto;
}

export interface UserRoleResponse {
  userId: string;
  userEmail: string;
  userName: string;
  roleName: "Cliente" | "Administrador";
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: "Cliente" | "Administrador";
  token: string;
  expiration: string;
}
