import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-edit-profile-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.css']
})
export class EditProfileModalComponent {
  @Input() user: any;
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  editedUser: any = {};
  loading = false;
  error: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnChanges() {
    if (this.user) {
      this.editedUser = { ...this.user };
    }
  }

  onSave() {
    this.loading = true;
    this.error = null;
    
    this.authService.updateProfile(this.editedUser).subscribe({
      next: (response) => {
        this.loading = false;
        // Émettre la réponse complète du serveur
        this.save.emit({
          ...response.user,
          ...response.client
        });
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Erreur lors de la mise à jour du profil';
      }
    });
  }

  onClose() {
    this.close.emit();
  }
}