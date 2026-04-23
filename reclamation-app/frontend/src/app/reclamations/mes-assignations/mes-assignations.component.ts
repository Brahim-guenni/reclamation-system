import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Reclamation, SuiviReclamation } from '../../models/models';

@Component({
  selector: 'app-mes-assignations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h4 class="mb-3"><i class="bi bi-clipboard-check me-2"></i>Mes Réclamations Assignées</h4>

    <!-- Suivi panel -->
    <div class="card mb-4 border-info" *ngIf="showSuivi && selectedRec">
      <div class="card-body">
        <h6 class="text-info">Suivi — #{{ selectedRec.id }} {{ selectedRec.produit }}</h6>
        <div style="max-height:200px;overflow-y:auto" class="mb-3">
          <div *ngFor="let s of suivis" class="border rounded p-2 mb-1 bg-light">
            <div class="d-flex justify-content-between">
              <strong>{{ s.action }}</strong>
              <small class="text-muted">{{ s.date | date:'dd/MM/yyyy HH:mm' }}</small>
            </div>
            <p class="mb-0 small">{{ s.message }}</p>
          </div>
          <p *ngIf="suivis.length===0" class="text-muted small">Aucun suivi pour l'instant</p>
        </div>
        <form (ngSubmit)="addSuivi()" class="row g-2">
          <div class="col-md-3">
            <input class="form-control form-control-sm" placeholder="Action effectuée"
                   [(ngModel)]="suiviForm.action" name="action" required>
          </div>
          <div class="col-md-6">
            <input class="form-control form-control-sm" placeholder="Message / commentaire"
                   [(ngModel)]="suiviForm.message" name="message" required>
          </div>
          <div class="col-auto">
            <button class="btn btn-info btn-sm text-white" type="submit">Ajouter</button>
            <button class="btn btn-secondary btn-sm ms-1" type="button" (click)="showSuivi=false">Fermer</button>
          </div>
        </form>
      </div>
    </div>

    <div class="row g-3">
      <div class="col-md-6" *ngFor="let r of reclamations">
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span><strong>{{ r.produit }}</strong></span>
            <span class="badge badge-{{ r.statut }}">{{ r.statut }}</span>
          </div>
          <div class="card-body">
            <p class="small text-muted mb-2">{{ r.description }}</p>
            <div class="small">
              <div *ngIf="r.client"><i class="bi bi-person me-1"></i>Client: {{ r.client.nom }}</div>
              <div><i class="bi bi-calendar me-1"></i>{{ r.date | date:'dd/MM/yyyy' }}</div>
            </div>
          </div>
          <div class="card-footer">
            <button class="btn btn-sm btn-outline-info" (click)="openSuivi(r)">
              <i class="bi bi-clock-history me-1"></i>Suivi
            </button>
            <button class="btn btn-sm btn-outline-success ms-2" (click)="marquerResolu(r)"
                    *ngIf="r.statut !== 'RESOLUE'">
              <i class="bi bi-check-circle me-1"></i>Marquer résolu
            </button>
          </div>
        </div>
      </div>
      <div class="col-12" *ngIf="reclamations.length===0">
        <div class="text-center text-muted py-5">
          <i class="bi bi-inbox fs-1 d-block mb-2"></i>
          Aucune réclamation assignée pour l'instant
        </div>
      </div>
    </div>
  `
})
export class MesAssignationsComponent implements OnInit {
  reclamations: Reclamation[] = [];
  suivis: SuiviReclamation[] = [];
  showSuivi = false;
  selectedRec?: Reclamation;
  suiviForm = { action: '', message: '' };

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.api.getMesAssignations().subscribe(d => this.reclamations = d);
  }

  openSuivi(r: Reclamation) {
    this.selectedRec = r;
    this.api.getSuivis(r.id!).subscribe(d => this.suivis = d);
    this.showSuivi = true;
  }

  addSuivi() {
    if (!this.selectedRec) return;
    const suivi: any = {
      message: this.suiviForm.message,
      action: this.suiviForm.action,
      reclamation: { id: this.selectedRec.id }
    };
    this.api.createSuivi(suivi).subscribe(() => {
      this.api.getSuivis(this.selectedRec!.id!).subscribe(d => this.suivis = d);
      this.suiviForm = { action: '', message: '' };
    });
  }

  marquerResolu(r: Reclamation) {
    const updated = { ...r, statut: 'RESOLUE' as any };
    this.api.updateReclamation(r.id!, updated).subscribe(() => this.load());
  }
}
