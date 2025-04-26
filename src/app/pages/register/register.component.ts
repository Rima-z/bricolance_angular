import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  num_tlf: string;
  region: string;
  adresse: string;
  password: string;
  password_confirmation: string;
  role: 'client' | 'prestataire';
  acceptTerms: boolean;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerData: RegisterData = {
    nom: '',
    prenom: '',
    email: '',
    num_tlf: '',
    region: '',
    adresse: '',
    password: '',
    password_confirmation: '',
    role: 'client',
    acceptTerms: false
  };
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {
    this.authService.register(this.registerData).subscribe({
      next: (response: any) => {
        console.log('Inscription réussie', response);
        if (response && response.token) {
          this.authService.saveToken(response.token);
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error: any) => {
        console.error('Erreur lors de l\'inscription', error);
        // TODO: Ajouter un message d'erreur pour l'utilisateur
      }
    });
  }
}
