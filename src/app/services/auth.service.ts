import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface RegisterResponse {
  message: string;
  user: any;
  client: any;
  prestataire: any;
  portfolio: any;
  token: string;
}

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
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(data: RegisterData): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, data);
  }

  login(email: string, password: string, remember: boolean = false): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password, remember });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
