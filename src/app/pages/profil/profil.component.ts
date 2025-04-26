import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  user: any = null;
  hasServices: boolean = false;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loading = true;
    this.error = null;

    // D'abord, essayer d'utiliser les données en cache
    if (this.authService.currentUser) {
      this.user = this.authService.currentUser;
      this.loading = false;
    }

    // Ensuite, rafraîchir les données depuis le serveur
    this.authService.getProfile().subscribe({
      next: (response) => {
        if (response.user) {
          this.user = {
            ...response.user,
            ...response.client
          };
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors du chargement du profil';
        this.loading = false;
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  ajouterService() {
    this.router.navigate(['/ajouter-service']);
  }

  ajouterPremierService() {
    this.router.navigate(['/ajouter-service']);
  }

  modifierProfil() {
    this.router.navigate(['/modifier-profil']);
  }
} 