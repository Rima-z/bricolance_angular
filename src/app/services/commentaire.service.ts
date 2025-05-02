// src/app/services/commentaire.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentaireService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCommentaires(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/commentaires`);
  }

  approuverCommentaire(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/commentaires/${id}`, { state: 1 });
  }

  refuserCommentaire(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/commentaires/${id}`, { state: -1 });
  }

  supprimerCommentaire(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/commentaires/${id}`);
  }
}