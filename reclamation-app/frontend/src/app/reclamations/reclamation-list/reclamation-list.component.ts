import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Reclamation, AgentSAV } from '../../models/models';

@Component({
  selector: 'app-reclamation-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h4 class="mb-3"><i class="bi bi-exclamation-circle me-2"></i>Toutes les Réclamations</h4>

    <!-- Assign agent panel -->
    <div class="card mb-4 border-primary" *ngIf="showAffectation">
      <div class="card-body">
        <h6 class="card-title text-primary">
          Affecter un agent — Réclamation #{{ selectedRec?.id }} ({{ selectedRec?.produit }})
        </h6>
        <div class="row g-2 align-items-center">
          <div class="col-md-5">
            <select class="form-select" [(ngModel)]="selectedAgentId">
              <option value="">-- Choisir un agent SAV --</option>
              <option *ngFor="let a of agents" [value]="a.id">
                {{ a.nom }} — {{ a.competence }}
              </option>
            </select>
          </div>
          <div class="col-auto">
            <button class="btn btn-primary btn-sm me-2" (click)="affecterAgent()"
                    [disabled]="!selectedAgentId">
              <i class="bi bi-person-check me-1"></i>Affecter
            </button>
            <button class="btn btn-secondary btn-sm" (click)="showAffectation=false">Annuler</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Suivi panel -->
    <div class="card mb-4 border-info" *ngIf="showSuivi">
      <div class="card-body">
        <h6 class="card-title text-info">Suivi — Réclamation #{{ selectedRec?.id }}</h6>
        <div class="mb-3" style="max-height:200px;overflow-y:auto">
          <div *ngFor="let s of suivis" class="border rounded p-2 mb-1 bg-light">
            <div class="d-flex justify-content-between">
              <strong>{{ s.action }}</strong>
              <small class="text-muted">{{ s.date | date:'dd/MM/yyyy HH:mm' }}</small>
            </div>
            <p class="mb-0 small">{{ s.message }}</p>
          </div>
          <p *ngIf="suivis.length===0" class="text-muted small">Aucun suivi</p>
        </div>
        <button class="btn btn-secondary btn-sm" (click)="showSuivi=false">Fermer</button>
      </div>
    </div>

    <!-- Filter bar -->
    <div class="card mb-3">
      <div class="card-body py-2">
        <div class="row g-2 align-items-center">
          <div class="col-auto">
            <label class="form-label mb-0 small">Filtrer par statut :</label>
          </div>
          <div class="col-auto" *ngFor="let s of statuts">
            <button class="btn btn-sm"
              [class.btn-primary]="filterStatut===s"
              [class.btn-outline-secondary]="filterStatut!==s"
              (click)="setFilter(s)">{{ s }}</button>
          </div>
          <div class="col-auto">
            <button class="btn btn-sm btn-outline-dark" (click)="setFilter('')">Tous</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="card">
      <div class="card-body p-0">
        <table class="table table-hover mb-0">
          <thead>
            <tr>
              <th>Client</th><th>Produit</th><th>Description</th>
              <th>Statut</th><th>Agent SAV</th><th>Date</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of filtered()">
              <td>{{ r.client?.nom || '—' }}</td>
              <td>{{ r.produit }}</td>
              <td class="small text-muted" style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                {{ r.description }}
              </td>
              <td>
                <span class="badge badge-{{ r.statut }}">{{ r.statut }}</span>
              </td>
              <td>
                <span *ngIf="r.agentSAV" class="badge bg-info text-dark">{{ r.agentSAV.nom }}</span>
                <span *ngIf="!r.agentSAV" class="text-muted small">Non assigné</span>
              </td>
              <td class="small">{{ r.date | date:'dd/MM/yyyy' }}</td>
              <td>
                <button class="btn btn-sm btn-outline-primary me-1" title="Affecter agent"
                        (click)="openAffectation(r)">
                  <i class="bi bi-person-check"></i>
                </button>
                <button class="btn btn-sm btn-outline-info" title="Voir suivi"
                        (click)="openSuivi(r)">
                  <i class="bi bi-clock-history"></i>
                </button>
              </td>
            </tr>
            <tr *ngIf="filtered().length===0">
              <td colspan="8" class="text-center text-muted py-3">Aucune réclamation</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ReclamationListComponent implements OnInit {
  reclamations: Reclamation[] = [];
  agents: AgentSAV[] = [];
  suivis: any[] = [];
  showAffectation = false;
  showSuivi = false;
  selectedRec?: Reclamation;
  selectedAgentId: number | string = '';
  filterStatut = '';
  statuts = ['EN_ATTENTE', 'EN_COURS', 'RESOLUE'];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.load();
    this.api.getAgents().subscribe(d => this.agents = d);
  }

  load() { this.api.getReclamations().subscribe(d => this.reclamations = d); }

  filtered() {
    if (!this.filterStatut) return this.reclamations;
    return this.reclamations.filter(r => r.statut === this.filterStatut);
  }

  setFilter(s: string) { this.filterStatut = s; }

  openAffectation(r: Reclamation) {
    this.selectedRec = r;
    this.selectedAgentId = r.agentSAV?.id || '';
    this.showSuivi = false;
    this.showAffectation = true;
  }

  affecterAgent() {
    if (!this.selectedRec || !this.selectedAgentId) return;
    this.api.affecterAgent(this.selectedRec.id!, +this.selectedAgentId).subscribe(() => {
      this.load();
      this.showAffectation = false;
    });
  }

  openSuivi(r: Reclamation) {
    this.selectedRec = r;
    this.showAffectation = false;
    this.api.getSuivis(r.id!).subscribe(d => this.suivis = d);
    this.showSuivi = true;
  }

  delete(id: number) {
    if (confirm('Supprimer cette réclamation ?')) {
      this.api.deleteReclamation(id).subscribe(() => this.load());
    }
  }
}
