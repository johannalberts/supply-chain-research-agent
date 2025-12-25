// Auth context types
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
}
