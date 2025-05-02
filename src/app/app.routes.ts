import { Routes } from '@angular/router';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CommentaireComponent } from './pages/commentaire/commentaire.component'; // Importer le composant

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component')
      .then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
  },
  {
    path: 'profil',
    loadComponent: () => import('./pages/profil/profil.component')
      .then(m => m.ProfilComponent)
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services/services.component')
      .then(m => m.ServicesComponent)
  },
  {
    path: 'categories',
    component: CategoriesComponent
  },
  // Ajoute la route pour les commentaires
  {
    path: 'commentaires',
    component: CommentaireComponent  // Ajoute ici ton composant de commentaires
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
