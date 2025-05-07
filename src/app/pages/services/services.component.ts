import { Component, OnInit, signal } from '@angular/core';
import { 
  HttpClient, 
  HttpErrorResponse 
} from '@angular/common/http';
import { 
  CommonModule, 
  NgFor, 
  NgIf 
} from '@angular/common';
import { 
  FormsModule, 
  ReactiveFormsModule, 
  FormBuilder, 
  FormGroup, 
  FormArray, 
  Validators 
} from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    NgFor,
    NgIf
  ],
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

  // Formulaire
  showAddFormModal = false;
  formSubCategories = signal<any[]>([]);
  serviceForm: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.serviceForm = this.fb.group({
      categorie_id: [null, Validators.required],
      sous_categorie_id: [null, Validators.required],
      prix: [0, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      portfolio_images: this.fb.array([]),
      portfolio_description: ['']
    });
  }

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

  // Méthodes du formulaire
  showAddForm() {
    this.showAddFormModal = true;
  }

  cancelAdd() {
    this.showAddFormModal = false;
    this.serviceForm.reset();
    this.formSubCategories.set([]);
    this.serviceForm.setControl('portfolio_images', this.fb.array([]));
  }

  onFormCategoryChange(categoryId: string) {
    const id = Number(categoryId);
    if (id) {
      this.http.get<any[]>(`http://localhost:8000/api/souscategories?categorie_id=${id}`)
        .subscribe({
          next: (subs) => this.formSubCategories.set(subs),
          error: () => this.error.set('Erreur de chargement des sous-catégories')
        });
    } else {
      this.formSubCategories.set([]);
      this.serviceForm.patchValue({ sous_categorie_id: null });
    }
  }

  get portfolioImages() {
    return this.serviceForm.get('portfolio_images') as FormArray;
  }

  addImage() {
    this.portfolioImages.push(this.fb.control('', Validators.required));
  }

  removeImage(index: number) {
    this.portfolioImages.removeAt(index);
  }

  submitService() {
    if (this.serviceForm.valid) {
      this.http.post('http://localhost:8000/api/services', this.serviceForm.value)
        .subscribe({
          next: () => {
            this.loadServices();
            this.cancelAdd();
            this.error.set(null);
          },
          error: (err: HttpErrorResponse) => {
            this.error.set(err.error?.message || 'Erreur lors de la création du service');
          }
        });
    }
  }
}