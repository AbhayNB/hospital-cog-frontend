export interface AuthResponse {
  accessToken?: string;
  message?: string;
  verified?: boolean;
  user?: User;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ROLE_ADMIN' | 'ROLE_DOCTOR' | 'ROLE_PATIENT';
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}
