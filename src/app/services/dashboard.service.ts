import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = 'http://localhost:8000/api/dashboard';

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getChartData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/charts`);
  }

  getCumulativeGrowth(): Observable<any> {
    return this.http.get(`${this.baseUrl}/cumulative-growth`);
  }

  getTopCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/top-categories`);
  }

  getTopCommentedServices(): Observable<any> {
    return this.http.get(`${this.baseUrl}/top-commented-services`);
  }
}