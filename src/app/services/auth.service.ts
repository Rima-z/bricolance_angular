import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

interface User {
  id: number;
  email: string;
  role: string;
  name: string;
  client?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    num_tlf: string;
    region: string;
    adresse: string;
  };
}

interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  num_tlf: string;
  region?: string;
  adresse: string;
  password: string;
  password_confirmation: string;
  role: 'client' | 'prestataire';
}

interface RegisterResponse {
  message: string;
  user: User;
  client: any;
  prestataire: any;
  portfolio: any;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  public currentUser: User | null = null;

  constructor(private http: HttpClient) {
    // Essayer de récupérer l'utilisateur du localStorage au démarrage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  register(data: RegisterData): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/auth/register`, data).pipe(
      tap((response) => {
        if (response && response.user) {
          this.setCurrentUser(response.user);
          this.saveToken(response.token);
        }
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((res: any) => {
        if (res && res.user) {
          this.setCurrentUser(res.user);
          this.saveToken(res.token);
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}).pipe(
      tap(() => {
        this.currentUser = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
    );
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/me`).pipe(
      tap((response: any) => {
        if (response.user) {
          const userData = {
            ...response.user,
            ...response.client
          };
          this.setCurrentUser(userData);
        }
      })
    );
  }

  updateProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/auth/profile/update`, profileData).pipe(
      tap((response: any) => {
        if (response.user) {
          const userData = {
            ...response.user,
            ...response.client
          };
          this.setCurrentUser(userData);
        }
      })
    );
  }

  setCurrentUser(user: any) {
    this.currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.currentUser;
  }
}
