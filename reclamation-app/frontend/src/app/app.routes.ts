import { Routes } from '@angular/router';
import { authGuard, adminGuard, agentGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
  },
  // CLIENT
  {
    path: 'mes-reclamations',
    canActivate: [authGuard],
    loadComponent: () => import('./reclamations/mes-reclamations/mes-reclamations.component')
      .then(m => m.MesReclamationsComponent)
  },
  // ADMIN
  {
    path: 'reclamations',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./reclamations/reclamation-list/reclamation-list.component')
      .then(m => m.ReclamationListComponent)
  },
  {
    path: 'clients',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./clients/client-list/client-list.component')
      .then(m => m.ClientListComponent)
  },
  {
    path: 'agents',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./agents/agent-list/agent-list.component')
      .then(m => m.AgentListComponent)
  },
  {
    path: 'rapport',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./rapport/rapport.component')
      .then(m => m.RapportComponent)
  },
  // AGENT_SAV
  {
    path: 'mes-assignations',
    canActivate: [authGuard, agentGuard],
    loadComponent: () => import('./reclamations/mes-assignations/mes-assignations.component')
      .then(m => m.MesAssignationsComponent)
  }
];
