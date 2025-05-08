import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EditProfileModalComponent } from '../../edit-profile-modal/edit-profile-modal.component';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, RouterLink, EditProfileModalComponent, FormsModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  user: any = null;
  loading: boolean = true;
  error: string | null = null;
  showModal: boolean = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.error = null;

    this.authService.getProfile().subscribe({
      next: (response) => {
        this.user = {
          ...response.user,
          ...response.client
        };
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

  modifierProfil() {
    this.showModal = true;
  }

  onProfileSaved(updatedUser: any) {
    // Mise à jour locale ET rechargement depuis le serveur
    this.user = updatedUser;
    this.showModal = false;
    this.loadProfile(); // Recharger les données depuis le serveur
  }

  onModalClosed() {
    this.showModal = false;
  }
}