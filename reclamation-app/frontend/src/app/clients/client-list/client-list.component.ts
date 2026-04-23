import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4><i class="bi bi-people me-2"></i>Clients inscrits</h4>
      <span class="badge bg-primary fs-6">{{ clients.length }} client(s)</span>
    </div>

    <div class="card">
      <div class="card-body p-0">
        <table class="table table-hover mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Réclamations</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of clients">
              <td>{{ c.id }}</td>
              <td><i class="bi bi-person-circle me-1 text-primary"></i>{{ c.nom }}</td>
              <td>{{ c.email }}</td>
              <td>
                <button class="btn btn-sm btn-outline-primary" (click)="voirReclamations(c)">
                  <i class="bi bi-exclamation-circle me-1"></i>Voir
                </button>
              </td>
              <td>
                <button class="btn btn-sm btn-outline-danger" (click)="deleteClient(c)"
                        title="Supprimer ce compte client">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
            <tr *ngIf="clients.length === 0">
              <td colspan="5" class="text-center text-muted py-4">
                <i class="bi bi-people fs-3 d-block mb-2"></i>
                Aucun client inscrit
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Réclamations du client sélectionné -->
    <div class="card mt-4" *ngIf="selectedClient">
      <div class="card-header d-flex justify-content-between align-items-center">
        <span>
          <i class="bi bi-exclamation-circle me-2"></i>
          Réclamations de <strong>{{ selectedClient.nom }}</strong>
        </span>
        <button class="btn btn-sm btn-outline-secondary" (click)="selectedClient=null">
          <i class="bi bi-x"></i> Fermer
        </button>
      </div>
      <div class="card-body p-0">
        <table class="table table-sm mb-0">
          <thead>
            <tr><th>Produit</th><th>Description</th><th>Statut</th><th>Agent SAV</th><th>Date</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of clientReclamations">
              <td>{{ r.produit }}</td>
              <td class="small text-muted">{{ r.description }}</td>
              <td><span class="badge badge-{{ r.statut }}">{{ r.statut }}</span></td>
              <td>{{ r.agentSAV?.nom || '—' }}</td>
              <td class="small">{{ r.date | date:'dd/MM/yyyy' }}</td>
            </tr>
            <tr *ngIf="clientReclamations.length === 0">
              <td colspan="5" class="text-center text-muted py-2">Aucune réclamation</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ClientListComponent implements OnInit {
  clients: any[] = [];
  selectedClient: any = null;
  clientReclamations: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.api.getRegisteredClients().subscribe(d => this.clients = d);
  }

  voirReclamations(c: any) {
    this.selectedClient = c;
    // use agentSavId which stores the clientId for CLIENT role
    if (c.agentSavId) {
      this.api.findReclamationsByClient(c.agentSavId).subscribe(d => this.clientReclamations = d);
    } else {
      this.clientReclamations = [];
    }
  }

  deleteClient(c: any) {
    if (confirm(`Supprimer le compte de ${c.nom} ? Cette action est irréversible.`)) {
      this.api.deleteClientAccount(c.id).subscribe(() => {
        if (this.selectedClient?.id === c.id) this.selectedClient = null;
        this.load();
      });
    }
  }
}
