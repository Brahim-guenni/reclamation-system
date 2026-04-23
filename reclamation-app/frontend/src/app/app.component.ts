import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary" *ngIf="auth.isLoggedIn()">
      <div class="container">
        <a class="navbar-brand"><i class="bi bi-headset me-2"></i>Gestion Réclamations</a>
        <div class="navbar-nav ms-auto d-flex align-items-center flex-row">

          <!-- ADMIN links -->
          <ng-container *ngIf="auth.isAdmin()">
            <a class="nav-link" routerLink="/reclamations" routerLinkActive="active">
              <i class="bi bi-exclamation-circle me-1"></i>Réclamations
            </a>
            <a class="nav-link" routerLink="/agents" routerLinkActive="active">
              <i class="bi bi-person-badge me-1"></i>Agents SAV
            </a>
            <a class="nav-link" routerLink="/clients" routerLinkActive="active">
              <i class="bi bi-people me-1"></i>Clients
            </a>
            <a class="nav-link" routerLink="/rapport" routerLinkActive="active">
              <i class="bi bi-bar-chart me-1"></i>Rapport
            </a>
          </ng-container>

          <!-- CLIENT links -->
          <ng-container *ngIf="auth.isClient()">
            <a class="nav-link" routerLink="/mes-reclamations" routerLinkActive="active">
              <i class="bi bi-exclamation-circle me-1"></i>Mes Réclamations
            </a>
          </ng-container>

          <!-- AGENT_SAV links -->
          <ng-container *ngIf="auth.isAgent()">
            <a class="nav-link" routerLink="/mes-assignations" routerLinkActive="active">
              <i class="bi bi-clipboard-check me-1"></i>Mes Assignations
            </a>
          </ng-container>

          <span class="nav-link text-white-50 ms-3">
            <i class="bi bi-person-circle me-1"></i>{{ auth.getUser()?.nom }}
            <span class="badge ms-1"
              [class.bg-danger]="auth.isAdmin()"
              [class.bg-success]="auth.isClient()"
              [class.bg-warning]="auth.isAgent()"
              [class.text-dark]="auth.isAgent()">
              {{ auth.getUser()?.role }}
            </span>
          </span>
          <button class="btn btn-outline-light btn-sm ms-2" (click)="auth.logout()">
            <i class="bi bi-box-arrow-right me-1"></i>Déconnexion
          </button>
        </div>
      </div>
    </nav>
    <div [class.container]="auth.isLoggedIn()" [class.mt-4]="auth.isLoggedIn()">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  constructor(public auth: AuthService) {}
}
