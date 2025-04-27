import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Service {
  id: number;
  prix: number;
  description: string;
  categorie_id: number;
  sous_categorie_id: number;
  prestataire_id: number;
  portfolio_id: number;
  categorie?: {
    id: number;
    nom: string;
  };
  sousCategorie?: {
    id: number;
    nom: string;
  };
  portfolio?: {
    id: number;
    images: string[];
    description: string;
  };
  prestataire?: {
    id: number;
    client: {
      id: number;
      nom: string;
      prenom: string;
      email: string;
      num_tlf: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllServices(): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}/services`);
  }

  getServiceById(id: number): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/services/${id}`);
  }
} 