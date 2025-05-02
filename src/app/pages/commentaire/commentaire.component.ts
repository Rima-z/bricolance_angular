// src/app/pages/commentaire/commentaire.component.ts
import { Component, OnInit } from '@angular/core';
import { CommentaireService } from '../../services/commentaire.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHome, faThLarge, faTools, faUser, faComments, faBell } from '@fortawesome/free-solid-svg-icons';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-commentaire',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  templateUrl: './commentaire.component.html',
  styleUrls: ['./commentaire.component.css']
})
export class CommentaireComponent implements OnInit {
  // Icônes FontAwesome
  faHome = faHome;
  faThLarge = faThLarge;
  faTools = faTools;
  faUser = faUser;
  faComments = faComments;
  faBell = faBell;

  commentaires: any[] = [];
  chargementEnCours = true;

  constructor(private commentaireService: CommentaireService) {}

  ngOnInit(): void {
    this.chargerCommentaires();
  }

  chargerCommentaires(): void {
    this.commentaireService.getCommentaires().subscribe({
      next: (data) => {
        this.commentaires = data;
        this.chargementEnCours = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.chargementEnCours = false;
      }
    });
  }

  approuver(id: number): void {
    this.commentaireService.approuverCommentaire(id).subscribe({
      next: () => {
        const index = this.commentaires.findIndex(c => c.id === id);
        if (index !== -1) this.commentaires[index].state = 1;
      },
      error: (error) => console.error('Erreur:', error)
    });
  }

  refuser(id: number): void {
    this.commentaireService.refuserCommentaire(id).subscribe({
      next: () => {
        const index = this.commentaires.findIndex(c => c.id === id);
        if (index !== -1) this.commentaires[index].state = -1;
      },
      error: (error) => console.error('Erreur:', error)
    });
  }

  supprimer(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce commentaire ?')) {
      this.commentaireService.supprimerCommentaire(id).subscribe({
        next: () => {
          this.commentaires = this.commentaires.filter(c => c.id !== id);
        },
        error: (error) => console.error('Erreur:', error)
      });
    }
  }

  getEtatCommentaire(state: number): string {
    switch(state) {
      case 1: return 'Approuvé';
      case -1: return 'Refusé';
      default: return 'En attente';
    }
  }

  getClasseEtat(state: number): string {
    switch(state) {
      case 1: return 'approuve';
      case -1: return 'refuse';
      default: return 'attente';
    }
  }
}