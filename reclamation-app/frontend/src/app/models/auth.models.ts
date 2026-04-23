export interface RegisterRequest {
  nom: string;
  email: string;
  password: string;
  telephone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  nom: string;
  role: 'CLIENT' | 'ADMIN' | 'AGENT_SAV';
}

export interface CreateAgentRequest {
  nom: string;
  email: string;
  password: string;
  competence: string;
}
