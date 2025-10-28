import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonBackButton, IonGrid, IonRow, IonCol, IonCardSubtitle, IonIcon, IonText, IonRippleEffect, IonCard, IonToggle } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '@components/core/services/auth.service';
import { User } from 'src/app/models/aniList/responseInterfaces';
import { ApiService } from '@components/core/services/api.service';
import { GET_CURRENT_USER } from 'src/app/models/aniList/mediaQueries';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonToggle, IonCard, IonRippleEffect, IonText, IonIcon, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonCardSubtitle]
})
export class SettingsPage implements OnInit {

  token: string | null = null;
  userData: User | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.refreshToken();
    this.loadUserData();
  }

  openUrl(url: string) {
    window.open(url, '_blank');
  }

  logOut() {
    this.authService.logout();

    this.router.navigate(['/profile']);
  }

  refreshToken() {
      this.token = this.authService.getToken();
      console.log('Token refreshed:', this.token ? 'Found' : 'Not found');
    }

    loadUserData() {
      if (!this.authService.isAuthenticated()) {
        console.log('User not authenticated, skipping data fetch');
        return;
      }

      this.loading = true;
      this.error = null;

      // First get the current user ID
      this.apiService.fetchCurrentUser(GET_CURRENT_USER).subscribe({
        next: (result) => {
          if (result.data?.Viewer) {
            const userId = result.data.Viewer.id;
            console.log('User ID:', userId);
          } else {
            this.loading = false;
            window.location.reload();
          }
        },
        error: (err) => {
          console.error('Error loading user ID:', err);
          this.error = 'Failed to load user data';
          this.loading = false;
        }
      });
    }
}
