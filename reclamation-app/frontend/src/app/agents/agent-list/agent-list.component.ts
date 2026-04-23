import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-agent-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4><i class="bi bi-person-badge me-2"></i>Agents SAV</h4>
      <button class="btn btn-primary" (click)="openForm()">
        <i class="bi bi-plus-lg me-1"></i>Créer un compte agent
      </button>
    </div>

    <!-- Create agent form -->
    <div class="card mb-4" *ngIf="showForm">
      <div class="card-body">
        <h6 class="card-title">Nouveau compte Agent SAV</h6>
        <div class="alert alert-danger" *ngIf="error">{{ error }}</div>
        <div class="alert alert-success" *ngIf="success">{{ success }}</div>
        <form (ngSubmit)="createAgent()">
          <div class="row g-2">
            <div class="col-md-3">
              <input class="form-control" placeholder="Nom" [(ngModel)]="agentForm.nom" name="nom" required>
            </div>
            <div class="col-md-3">
              <input class="form-control" placeholder="Email" type="email"
                     [(ngModel)]="agentForm.email" name="email" required>
            </div>
            <div class="col-md-3">
              <input class="form-control" placeholder="Mot de passe (min 6)" type="password"
                     [(ngModel)]="agentForm.password" name="password" required>
            </div>
            <div class="col-md-3">
              <input class="form-control" placeholder="Compétence (ex: Technique, Commercial...)"
                     [(ngModel)]="agentForm.competence" name="competence" required>
            </div>
          </div>
          <div class="mt-2">
            <button class="btn btn-success btn-sm me-2" type="submit">Créer le compte</button>
            <button class="btn btn-secondary btn-sm" type="button" (click)="showForm=false">Annuler</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Agents list -->
    <div class="card">
      <div class="card-body p-0">
        <table class="table table-hover mb-0">
          <thead>
            <tr><th>#</th><th>Nom</th><th>Email</th><th>Compétence</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let a of agents">
              <td>{{ a.id }}</td>
              <td><i class="bi bi-person-badge me-1 text-info"></i>{{ a.nom }}</td>
              <td>{{ a.email }}</td>
              <td><span class="badge bg-info text-dark">{{ a.agentCompetence || '—' }}</span></td>
              <td>
                <button class="btn btn-sm btn-outline-danger" (click)="deleteAgent(a)"
                        title="Supprimer ce compte agent">
                  <i class="bi bi-trash me-1"></i>Supprimer
                </button>
              </td>
            </tr>
            <tr *ngIf="agents.length === 0">
              <td colspan="5" class="text-center text-muted py-4">
                <i class="bi bi-person-badge fs-3 d-block mb-2"></i>
                Aucun agent SAV
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AgentListComponent implements OnInit {
  agents: any[] = [];
  showForm = false;
  error = '';
  success = '';
  agentForm = { nom: '', email: '', password: '', competence: '' };

  constructor(private api: ApiService, private authService: AuthService) {}

  ngOnInit() { this.load(); }

  load() {
    // get registered agent users + enrich with competence from agentSAV
    this.api.getRegisteredAgents().subscribe(users => {
      this.api.getAgents().subscribe(agentEntities => {
        this.agents = users.map(u => ({
          ...u,
          agentCompetence: agentEntities.find(a => a.id === u.agentSavId)?.competence
        }));
      });
    });
  }

  openForm() {
    this.agentForm = { nom: '', email: '', password: '', competence: '' };
    this.error = '';
    this.success = '';
    this.showForm = true;
  }

  createAgent() {
    this.error = '';
    this.authService.createAgent(this.agentForm).subscribe({
      next: (res) => {
        this.success = `Compte créé pour ${res.nom} (${res.email})`;
        this.load();
        this.agentForm = { nom: '', email: '', password: '', competence: '' };
      },
      error: (err) => this.error = err.error?.error || 'Erreur lors de la création'
    });
  }

  deleteAgent(a: any) {
    if (confirm(`Supprimer le compte de l'agent ${a.nom} ? Cette action est irréversible.`)) {
      this.api.deleteAgentAccount(a.id).subscribe(() => this.load());
    }
  }
}
