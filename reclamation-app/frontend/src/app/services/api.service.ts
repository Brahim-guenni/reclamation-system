import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, AgentSAV, Reclamation, SuiviReclamation, Rapport } from '../models/models';

// Relative path — works on localhost AND in Kubernetes via nginx proxy
const API = '/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  // Admin user management
  getRegisteredClients(): Observable<any[]> { return this.http.get<any[]>(`${API}/admin/clients`); }
  getRegisteredAgents(): Observable<any[]> { return this.http.get<any[]>(`${API}/admin/agents`); }
  deleteClientAccount(userId: number): Observable<void> { return this.http.delete<void>(`${API}/admin/clients/${userId}`); }
  deleteAgentAccount(userId: number): Observable<void> { return this.http.delete<void>(`${API}/admin/agents/${userId}`); }

  // Clients
  getClients(): Observable<Client[]> { return this.http.get<Client[]>(`${API}/clients`); }
  createClient(c: Client): Observable<Client> { return this.http.post<Client>(`${API}/clients`, c); }
  updateClient(id: number, c: Client): Observable<Client> { return this.http.put<Client>(`${API}/clients/${id}`, c); }
  deleteClient(id: number): Observable<void> { return this.http.delete<void>(`${API}/clients/${id}`); }

  // Agents SAV
  getAgents(): Observable<AgentSAV[]> { return this.http.get<AgentSAV[]>(`${API}/agents`); }
  deleteAgent(id: number): Observable<void> { return this.http.delete<void>(`${API}/agents/${id}`); }

  // Réclamations - ADMIN
  getReclamations(): Observable<Reclamation[]> { return this.http.get<Reclamation[]>(`${API}/reclamations`); }
  updateReclamation(id: number, r: any): Observable<Reclamation> { return this.http.put<Reclamation>(`${API}/reclamations/${id}`, r); }
  deleteReclamation(id: number): Observable<void> { return this.http.delete<void>(`${API}/reclamations/${id}`); }
  affecterAgent(reclamationId: number, agentId: number): Observable<Reclamation> {
    return this.http.put<Reclamation>(`${API}/reclamations/${reclamationId}/affecter/${agentId}`, {});
  }
  getRapport(): Observable<Rapport> { return this.http.get<Rapport>(`${API}/reclamations/rapport`); }

  // Réclamations - CLIENT
  getMesReclamations(): Observable<Reclamation[]> { return this.http.get<Reclamation[]>(`${API}/reclamations/mes`); }
  createReclamation(r: any): Observable<Reclamation> { return this.http.post<Reclamation>(`${API}/reclamations`, r); }

  // Réclamations - AGENT_SAV
  getMesAssignations(): Observable<Reclamation[]> { return this.http.get<Reclamation[]>(`${API}/reclamations/assignees`); }

  // Suivis
  getSuivis(reclamationId: number): Observable<SuiviReclamation[]> {
    return this.http.get<SuiviReclamation[]>(`${API}/suivis/reclamation/${reclamationId}`);
  }
  createSuivi(s: any): Observable<SuiviReclamation> { return this.http.post<SuiviReclamation>(`${API}/suivis`, s); }

  findReclamationsByClient(clientId: number): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${API}/reclamations/client/${clientId}`);
  }
}
