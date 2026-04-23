import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%);
      display: flex; align-items: center; justify-content: center;
    }
    .login-card {
      width: 100%; max-width: 420px;
      border: none; border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .logo-circle {
      width: 72px; height: 72px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 16px;
    }
    .role-btn {
      flex: 1; padding: 10px; border-radius: 10px;
      border: 2px solid #e2e8f0; background: #f8fafc;
      cursor: pointer; transition: all 0.2s; text-align: center;
    }
    .role-btn:hover { border-color: #93c5fd; background: #eff6ff; }
    .role-btn.active-client {
      border-color: #16a34a; background: #f0fdf4; color: #15803d;
    }
    .role-btn.active-admin {
      border-color: #dc2626; background: #fef2f2; color: #dc2626;
    }
    .role-btn i { font-size: 1.4rem; display: block; margin-bottom: 4px; }
    .form-control:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.15); }
    .btn-login { border: none; border-radius: 8px; padding: 12px; font-weight: 600; }
  `],
  template: `
    <div class="login-wrapper">
      <div class="login-card card p-4">

        <!-- Logo -->
        <div class="text-center mb-3">
          <div class="logo-circle"
               [style.background]="selectedRole === 'ADMIN'
                 ? 'linear-gradient(135deg,#dc2626,#991b1b)'
                 : 'linear-gradient(135deg,#16a34a,#15803d)'">
            <i class="bi text-white fs-3"
               [class.bi-shield-lock-fill]="selectedRole === 'ADMIN'"
               [class.bi-person-fill]="selectedRole !== 'ADMIN'"></i>
          </div>
          <h4 class="fw-bold mb-1">Gestion des Réclamations</h4>
          <p class="text-muted small mb-0">Connectez-vous à votre espace</p>
        </div>

        <!-- Role selector -->
        <div class="d-flex gap-2 mb-4">
          <div class="role-btn"
               [class.active-client]="selectedRole === 'CLIENT'"
               (click)="selectRole('CLIENT')">
            <i class="bi bi-person-circle"></i>
            <span class="fw-semibold small">Client</span>
          </div>
          <div class="role-btn"
               [class.active-admin]="selectedRole === 'ADMIN'"
               (click)="selectRole('ADMIN')">
            <i class="bi bi-shield-lock"></i>
            <span class="fw-semibold small">Administrateur</span>
          </div>
        </div>

        <!-- Role badge -->
        <div class="text-center mb-3">
          <span class="badge px-3 py-2 rounded-pill"
                [class.bg-success]="selectedRole === 'CLIENT'"
                [class.bg-danger]="selectedRole === 'ADMIN'">
            <i class="bi me-1"
               [class.bi-person-fill]="selectedRole === 'CLIENT'"
               [class.bi-shield-fill]="selectedRole === 'ADMIN'"></i>
            Espace {{ selectedRole === 'ADMIN' ? 'Administrateur' : 'Client' }}
          </span>
        </div>

        <!-- Error -->
        <div class="alert alert-danger d-flex align-items-center py-2 small" *ngIf="error">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ error }}
        </div>

        <!-- Form -->
        <form (ngSubmit)="submit()">
          <div class="mb-3">
            <label class="form-label fw-semibold small">Adresse email</label>
            <div class="input-group">
              <span class="input-group-text bg-white">
                <i class="bi bi-envelope text-muted"></i>
              </span>
              <input class="form-control" type="email" [(ngModel)]="form.email"
                     name="email" placeholder="votre@email.com" required>
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label fw-semibold small">Mot de passe</label>
            <div class="input-group">
              <span class="input-group-text bg-white">
                <i class="bi bi-lock text-muted"></i>
              </span>
              <input class="form-control" [type]="showPwd ? 'text' : 'password'"
                     [(ngModel)]="form.password" name="password"
                     placeholder="••••••••" required>
              <span class="input-group-text" style="cursor:pointer" (click)="showPwd=!showPwd">
                <i class="bi text-muted"
                   [class.bi-eye]="!showPwd" [class.bi-eye-slash]="showPwd"></i>
              </span>
            </div>
          </div>

          <button class="btn btn-login w-100 text-white" type="submit" [disabled]="loading"
                  [class.btn-success]="selectedRole === 'CLIENT'"
                  [class.btn-danger]="selectedRole === 'ADMIN'">
            <span class="spinner-border spinner-border-sm me-2" *ngIf="loading"></span>
            <i class="bi bi-box-arrow-in-right me-1" *ngIf="!loading"></i>
            Se connecter en tant que {{ selectedRole === 'ADMIN' ? 'Admin' : 'Client' }}
          </button>
        </form>

        <hr class="my-3">
        <p class="text-center small mb-0 text-muted" *ngIf="selectedRole === 'CLIENT'">
          Pas encore de compte ?
          <a routerLink="/register" class="text-success fw-semibold text-decoration-none">
            Créer un compte
          </a>
        </p>
        <p class="text-center small mb-0 text-muted" *ngIf="selectedRole === 'ADMIN'">
          <i class="bi bi-info-circle me-1"></i>
          Accès réservé aux administrateurs autorisés
        </p>

      </div>
    </div>
  `
})
export class LoginComponent {
  selectedRole: 'CLIENT' | 'ADMIN' = 'CLIENT';
  form = { email: '', password: '' };
  error = '';
  loading = false;
  showPwd = false;

  constructor(private auth: AuthService, private router: Router) {}

  selectRole(role: 'CLIENT' | 'ADMIN') {
    this.selectedRole = role;
    this.error = '';
    this.form = { email: '', password: '' };
  }

  submit() {
    this.error = '';
    this.loading = true;
    this.auth.login(this.form).subscribe({
      next: (res) => {
        this.loading = false;
        // Role isolation check
        if (this.selectedRole === 'ADMIN' && res.role !== 'ADMIN') {
          this.auth.logout();
          this.error = 'Accès refusé : ce compte n\'est pas administrateur.';
          return;
        }
        if (this.selectedRole === 'CLIENT' && res.role === 'ADMIN') {
          this.auth.logout();
          this.error = 'Veuillez utiliser l\'espace Administrateur.';
          return;
        }
        if (res.role === 'ADMIN')          this.router.navigate(['/reclamations']);
        else if (res.role === 'AGENT_SAV') this.router.navigate(['/mes-assignations']);
        else                               this.router.navigate(['/mes-reclamations']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Email ou mot de passe incorrect';
      }
    });
  }
}
