import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CategorieService } from '../../services/categorie.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  loading = true;
  error: string | null = null;
  nouvelleCategorie = '';
  editingId: number | null = null;
  editValue = '';

  constructor(private categorieService: CategorieService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = null;
    
    this.categorieService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des catégories';
        this.loading = false;
        console.error(err);
      }
    });
  }

  ajouterCategorie(): void {
    if (!this.nouvelleCategorie) return;
    
    this.categorieService.createCategorie(this.nouvelleCategorie).subscribe({
      next: () => {
        this.loadCategories();
        this.nouvelleCategorie = '';
      },
      error: (err) => {
        this.error = "Erreur lors de l'ajout";
        console.error(err);
      }
    });
  }

  commencerEdition(id: number, nom: string): void {
    this.editingId = id;
    this.editValue = nom;
  }

  annulerEdition(): void {
    this.editingId = null;
    this.editValue = '';
  }

  validerEdition(id: number): void {
    this.categorieService.updateCategorie(id, this.editValue).subscribe({
      next: () => {
        this.loadCategories();
        this.editingId = null;
      },
      error: (err) => {
        this.error = "Erreur lors de la modification";
        console.error(err);
      }
    });
  }

  supprimerCategorie(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      this.categorieService.deleteCategorie(id).subscribe({
        next: () => this.loadCategories(),
        error: (err) => {
          this.error = "Erreur lors de la suppression";
          console.error(err);
        }
      });
    }
  }
}