import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  private apiUrl = 'http://localhost:8000/api/categories'; // Modifie si besoin

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createCategorie(nom: string): Observable<any> {
    return this.http.post(this.apiUrl, { nom });
  }

  updateCategorie(id: number, nom: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { nom });
  }

  deleteCategorie(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
