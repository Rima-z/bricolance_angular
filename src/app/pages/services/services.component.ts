import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  // Signaux
  services = signal<any[]>([]);
  categories = signal<any[]>([]);
  subCategories = signal<any[]>([]);
  selectedCategory = signal<number | null>(null);
  selectedSubCategory = signal<number | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCategories();
    this.loadServices();
  }

  loadCategories() {
    this.http.get<any[]>('http://localhost:8000/api/categories').subscribe({
      next: (categories) => this.categories.set(categories),
      error: () => this.error.set('Erreur de chargement des catégories')
    });
  }

  loadServices() {
    this.loading.set(true);
    let url = 'http://localhost:8000/api/services?';

    if (this.selectedCategory()) {
      url += `categorie_id=${this.selectedCategory()}&`;
    }
    
    if (this.selectedSubCategory()) {
      url += `sous_categorie_id=${this.selectedSubCategory()}`;
    }

    this.http.get<any[]>(url).subscribe({
      next: (services) => {
        this.services.set(services);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erreur de chargement des services');
        this.loading.set(false);
      }
    });
  }

  onCategoryChange(categoryId: number | null) {
    this.selectedCategory.set(categoryId);
    this.selectedSubCategory.set(null);
    this.loadSubCategories(categoryId);
    this.loadServices();
  }

  loadSubCategories(categoryId: number | null) {
    if (!categoryId) {
      this.subCategories.set([]);
      return;
    }

    this.http.get<any[]>(`http://localhost:8000/api/souscategories?categorie_id=${categoryId}`)
      .subscribe({
        next: (subs) => this.subCategories.set(subs),
        error: () => this.error.set('Erreur de chargement des sous-catégories')
      });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-TN', { 
      style: 'currency', 
      currency: 'TND' 
    }).format(price);
  }
}