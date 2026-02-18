export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
}

export interface LoginPayload {
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  code?: string;
}
