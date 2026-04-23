import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div class="card shadow" style="width: 460px;">
        <div class="card-body p-4">
          <div class="text-center mb-4">
            <i class="bi bi-person-plus fs-1 text-primary"></i>
            <h4 class="mt-2">Créer un compte Client</h4>
            <p class="text-muted small">Gestion des Réclamations</p>
          </div>

          <div class="alert alert-danger" *ngIf="error">{{ error }}</div>

          <form (ngSubmit)="submit()">
            <div class="mb-3">
              <label class="form-label">Nom complet</label>
              <input class="form-control" [(ngModel)]="form.nom" name="nom"
                     placeholder="Votre nom" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input class="form-control" type="email" [(ngModel)]="form.email"
                     name="email" placeholder="votre@email.com" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Téléphone</label>
              <input class="form-control" [(ngModel)]="form.telephone"
                     name="telephone" placeholder="06 00 00 00 00">
            </div>
            <div class="mb-3">
              <label class="form-label">Mot de passe</label>
              <div class="input-group">
                <input class="form-control" [type]="showPwd ? 'text' : 'password'"
                       [(ngModel)]="form.password" name="password"
                       placeholder="Minimum 6 caractères" required>
                <button class="btn btn-outline-secondary" type="button" (click)="showPwd=!showPwd">
                  <i class="bi" [class.bi-eye]="!showPwd" [class.bi-eye-slash]="showPwd"></i>
                </button>
              </div>
            </div>
            <button class="btn btn-primary w-100" type="submit" [disabled]="loading">
              <span class="spinner-border spinner-border-sm me-2" *ngIf="loading"></span>
              S'inscrire
            </button>
          </form>

          <hr>
          <p class="text-center mb-0 small">
            Déjà un compte ? <a routerLink="/login">Se connecter</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  form = { nom: '', email: '', telephone: '', password: '' };
  error = '';
  loading = false;
  showPwd = false;

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = '';
    this.loading = true;
    this.auth.register(this.form).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/mes-reclamations']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Erreur lors de l\'inscription';
      }
    });
  }
}
