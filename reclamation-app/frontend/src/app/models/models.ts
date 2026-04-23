export interface Client {
  id?: number;
  nom: string;
  email: string;
  telephone: string;
}

export interface AgentSAV {
  id?: number;
  nom: string;
  competence: string;
}

export type StatutReclamation = 'EN_ATTENTE' | 'EN_COURS' | 'RESOLUE' | 'REJETEE';

export interface Reclamation {
  id?: number;
  client: Client;
  produit: string;
  statut: StatutReclamation;
  description: string;
  date?: string;
  note?: number;
  agentSAV?: AgentSAV;
}

export interface SuiviReclamation {
  id?: number;
  message: string;
  reclamation: Reclamation;
  agent?: AgentSAV;
  action: string;
  date?: string;
}

export interface Rapport {
  noteMoyenne: number;
  total: number;
  parStatut: { [key: string]: number };
  tauxResolution: number;
}
