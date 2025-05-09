import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
    RouterModule // Ajouté pour router-outlet
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Statistiques de base
  totalUsers: number = 0;
  totalServices: number = 0;
  totalCommentaires: number = 0;
  totalCategories: number = 0;

  // Configuration des graphiques
  public lineChartType = 'line' as const;
  public barChartType = 'bar' as const;

  // Données pour les graphiques
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55],
        label: 'Utilisateurs',
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3
      },
      {
        data: [28, 48, 40, 19, 86, 27],
        label: 'Services',
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        tension: 0.3
      }
    ]
  };

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Catégorie 1', 'Catégorie 2', 'Catégorie 3', 'Catégorie 4'],
    datasets: [{
      data: [65, 59, 80, 81],
      label: 'Services par catégorie',
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)'
      ],
      borderWidth: 1
    }]
  };

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Activité récente'
      }
    }
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Répartition par catégorie'
      }
    }
  };

  constructor(
    private dashboardService: DashboardService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadBasicStats();
    this.loadChartData();
  }

  private loadBasicStats(): void {
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.totalUsers = data.totalUsers;
        this.totalServices = data.totalServices;
        this.totalCommentaires = data.totalCommentaires;
        this.totalCategories = data.totalCategories;
      },
      error: (err) => console.error('Erreur stats:', err)
    });
  }

  private loadChartData(): void {
    this.dashboardService.getChartData().subscribe({
      next: (data) => {
        this.lineChartData = {
          labels: data.monthlyStats.labels,
          datasets: [
            {
              data: data.monthlyStats.users,
              label: 'Nouveaux utilisateurs',
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.3
            },
            {
              data: data.monthlyStats.services,
              label: 'Services ajoutés',
              borderColor: 'rgba(153, 102, 255, 1)',
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              tension: 0.3
            }
          ]
        };

        this.barChartData = {
          labels: data.categoryStats.labels,
          datasets: [{
            data: data.categoryStats.counts,
            label: 'Services par catégorie',
            backgroundColor: data.categoryStats.colors,
            borderColor: data.categoryStats.borderColors,
            borderWidth: 1
          }]
        };
      },
      error: (err) => console.error('Erreur graphiques:', err)
    });
  }

  isActive(routePath: string): boolean {
    return this.router.url === routePath;
  }
}