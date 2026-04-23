import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { Rapport } from '../models/models';

@Component({
  selector: 'app-rapport',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h4 class="mb-4"><i class="bi bi-bar-chart me-2"></i>Rapport de satisfaction client</h4>

    <div class="row g-3" *ngIf="rapport">
      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <h2 class="text-primary">{{ rapport.total }}</h2>
            <p class="text-muted mb-0">Total réclamations</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <h2 class="text-warning">
              {{ rapport.noteMoyenne ? (rapport.noteMoyenne | number:'1.1-1') : 'N/A' }}
              <i class="bi bi-star-fill" *ngIf="rapport.noteMoyenne"></i>
            </h2>
            <p class="text-muted mb-0">Note moyenne</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <h2 class="text-success">{{ rapport.tauxResolution | number:'1.0-1' }}%</h2>
            <p class="text-muted mb-0">Taux de résolution</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <h2 class="text-info">{{ rapport.parStatut['RESOLUE'] || 0 }}</h2>
            <p class="text-muted mb-0">Réclamations résolues</p>
          </div>
        </div>
      </div>
    </div>

    <div class="card mt-4" *ngIf="rapport">
      <div class="card-body">
        <h6 class="card-title">Répartition par statut</h6>
        <div *ngFor="let entry of getStatutEntries()">
          <div class="d-flex justify-content-between mb-1">
            <span class="badge badge-{{ entry.key }}">{{ entry.key }}</span>
            <span>{{ entry.value }} réclamation(s)</span>
          </div>
          <div class="progress mb-2" style="height: 8px;">
            <div class="progress-bar" [style.width.%]="(entry.value / rapport!.total) * 100"></div>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="!rapport" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>
  `
})
export class RapportComponent implements OnInit {
  rapport?: Rapport;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getRapport().subscribe(d => this.rapport = d);
  }

  getStatutEntries(): { key: string; value: number }[] {
    if (!this.rapport) return [];
    return Object.entries(this.rapport.parStatut).map(([key, value]) => ({ key, value }));
  }
}
