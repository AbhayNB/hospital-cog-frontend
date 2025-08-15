export interface AuthResponse {
  accessToken?: string;
  message?: string;
  verified?: boolean;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
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
