import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Reclamation } from '../../models/models';

@Component({
  selector: 'app-mes-reclamations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    .star { font-size: 1.6rem; cursor: pointer; color: #d1d5db; transition: color 0.15s; }
    .star.filled { color: #f59e0b; }
    .star:hover { color: #fbbf24; }
    .card-reclamation { border-left: 4px solid #e2e8f0; transition: box-shadow 0.2s; }
    .card-reclamation:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .card-reclamation.EN_ATTENTE { border-left-color: #f59e0b; }
    .card-reclamation.EN_COURS   { border-left-color: #3b82f6; }
    .card-reclamation.RESOLUE    { border-left-color: #10b981; }
  `],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4><i class="bi bi-exclamation-circle me-2"></i>Mes Réclamations</h4>
      <button class="btn btn-primary" (click)="openForm()">
        <i class="bi bi-plus-lg me-1"></i>Soumettre une réclamation
      </button>
    </div>

    <!-- Formulaire soumission (sans note) -->
    <div class="card mb-4" *ngIf="showForm">
      <div class="card-body">
        <h6 class="card-title">Nouvelle réclamation</h6>
        <form (ngSubmit)="save()">
          <div class="mb-3">
            <label class="form-label small fw-semibold">Produit concerné</label>
            <input class="form-control" placeholder="Ex: Téléphone, Livraison, Facture..."
                   [(ngModel)]="form.produit" name="produit" required>
          </div>
          <div class="mb-3">
            <label class="form-label small fw-semibold">Description du problème</label>
            <textarea class="form-control" placeholder="Décrivez votre problème en détail..."
                      [(ngModel)]="form.description" name="description" rows="3" required></textarea>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-success btn-sm" type="submit">
              <i class="bi bi-send me-1"></i>Envoyer
            </button>
            <button class="btn btn-secondary btn-sm" type="button" (click)="showForm=false">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal évaluation -->
    <div class="card mb-4 border-warning" *ngIf="showEval && evalRec">
      <div class="card-body text-center">
        <h6 class="card-title">
          <i class="bi bi-star-fill text-warning me-2"></i>
          Évaluer la résolution — {{ evalRec.produit }}
        </h6>
        <p class="text-muted small mb-3">
          Votre réclamation a été résolue. Donnez une note de satisfaction.
        </p>
        <div class="mb-3">
          <span *ngFor="let i of [1,2,3,4,5]"
                class="star"
                [class.filled]="i <= hoverNote || i <= evalNote"
                (mouseenter)="hoverNote=i"
                (mouseleave)="hoverNote=0"
                (click)="evalNote=i">
            ★
          </span>
        </div>
        <p class="small text-muted mb-3" *ngIf="evalNote > 0">
          {{ noteLabel[evalNote] }}
        </p>
        <div class="d-flex gap-2 justify-content-center">
          <button class="btn btn-warning btn-sm" (click)="submitEval()"
                  [disabled]="evalNote === 0">
            <i class="bi bi-check-circle me-1"></i>Soumettre mon évaluation
          </button>
          <button class="btn btn-secondary btn-sm" (click)="showEval=false">Annuler</button>
        </div>
      </div>
    </div>

    <!-- Liste des réclamations -->
    <div class="row g-3" *ngIf="reclamations.length > 0">
      <div class="col-md-6" *ngFor="let r of reclamations">
        <div class="card card-reclamation h-100" [class]="'card-reclamation ' + r.statut">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h6 class="card-title mb-0">
                <i class="bi bi-box me-1 text-muted"></i>{{ r.produit }}
              </h6>
              <span class="badge badge-{{ r.statut }}">{{ r.statut }}</span>
            </div>
            <p class="card-text small text-muted mb-3">{{ r.description }}</p>
            <div class="small text-muted">
              <div class="mb-1">
                <i class="bi bi-calendar3 me-1"></i>{{ r.date | date:'dd/MM/yyyy' }}
              </div>
              <div class="mb-1" *ngIf="r.agentSAV">
                <i class="bi bi-person-badge me-1 text-info"></i>
                Agent : <strong>{{ r.agentSAV.nom }}</strong>
              </div>
              <div class="mb-1" *ngIf="!r.agentSAV">
                <i class="bi bi-hourglass-split me-1 text-warning"></i>
                En attente d'affectation
              </div>
              <!-- Note affichée si déjà évaluée -->
              <div *ngIf="r.note">
                <i class="bi bi-star-fill text-warning me-1"></i>
                Votre note : <strong>{{ r.note }}/5</strong>
                <span class="ms-1">{{ noteLabel[r.note] }}</span>
              </div>
            </div>
          </div>
          <!-- Bouton évaluer uniquement si RESOLUE et pas encore noté -->
          <div class="card-footer bg-transparent" *ngIf="r.statut === 'RESOLUE' && !r.note">
            <button class="btn btn-warning btn-sm w-100" (click)="openEval(r)">
              <i class="bi bi-star me-1"></i>Évaluer la résolution
            </button>
          </div>
          <!-- Bouton supprimer si pas encore résolu -->
          <div class="card-footer bg-transparent pt-0" *ngIf="r.statut !== 'RESOLUE'">
            <button class="btn btn-outline-danger btn-sm w-100" (click)="deleteRec(r)">
              <i class="bi bi-trash me-1"></i>Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div class="text-center text-muted py-5" *ngIf="reclamations.length === 0 && !showForm">
      <i class="bi bi-inbox fs-1 d-block mb-2"></i>
      Vous n'avez pas encore de réclamations
    </div>
  `
})
export class MesReclamationsComponent implements OnInit {
  reclamations: Reclamation[] = [];
  showForm = false;
  form: Partial<Reclamation> = {};

  showEval = false;
  evalRec?: Reclamation;
  evalNote = 0;
  hoverNote = 0;

  noteLabel: Record<number, string> = {
    1: '😞 Très insatisfait',
    2: '😕 Insatisfait',
    3: '😐 Neutre',
    4: '😊 Satisfait',
    5: '😄 Très satisfait'
  };

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.api.getMesReclamations().subscribe(d => this.reclamations = d);
  }

  openForm() {
    this.form = {};
    this.showForm = true;
  }

  save() {
    const payload: any = {
      produit: this.form.produit,
      description: this.form.description,
      statut: 'EN_ATTENTE'
    };
    this.api.createReclamation(payload).subscribe(() => {
      this.load();
      this.showForm = false;
    });
  }

  openEval(r: Reclamation) {
    this.evalRec = r;
    this.evalNote = 0;
    this.hoverNote = 0;
    this.showEval = true;
  }

  submitEval() {
    if (!this.evalRec || this.evalNote === 0) return;
    const updated = { ...this.evalRec, note: this.evalNote };
    this.api.updateReclamation(this.evalRec.id!, updated).subscribe(() => {
      this.showEval = false;
      this.load();
    });
  }

  deleteRec(r: Reclamation) {
    if (confirm('Supprimer cette réclamation ?')) {
      this.api.deleteReclamation(r.id!).subscribe(() => this.load());
    }
  }
}
