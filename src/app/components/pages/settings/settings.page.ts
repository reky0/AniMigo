import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '@components/core/services/api.service';
import { AuthService } from '@components/core/services/auth.service';
import { ToastService } from '@components/core/services/toast.service';
import { IonBackButton, IonButtons, IonCardSubtitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonRow, IonText, IonTitle, IonToggle, IonToolbar } from '@ionic/angular/standalone';
import { GET_CURRENT_USER } from 'src/app/models/aniList/mediaQueries';
import { User } from 'src/app/models/aniList/responseInterfaces';

@Component({
  selector: 'am-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonToggle, IonText, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonCardSubtitle]
})
export class SettingsPage implements OnInit {

  token: string | null = null;
  userData: User | null = null;
  loading: boolean = false;
  error: string | null = null;
  updatingSettings: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.toastService.setTabBarVisibility(false);
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
  }

  loadUserData() {
    if (!this.authService.isAuthenticated()) {
      return;
    }

    this.loading = true;
    this.error = null;

    // First get the current user ID
    this.apiService.fetchCurrentUser(GET_CURRENT_USER).subscribe({
      next: (result) => {
        if (result.data?.Viewer) {
          this.userData = result.data.Viewer;
          // Store in AuthService for shared access
          this.authService.setUserData(result.data.Viewer);
          this.loading = false;
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

  /**
   * Toggle adult content display setting
   * @param event - Ion toggle event
   */
  onAdultContentToggle(event: any) {
    if (this.updatingSettings || !this.userData) return;

    const newValue = event.detail.checked;
    this.updatingSettings = true;

    this.apiService.toggleAdultContent(newValue).subscribe({
      next: (result) => {
        if (result.success && result.userData) {
          // Update local user data with the response (create new object to avoid read-only issue)
          if (this.userData) {
            this.userData = {
              ...this.userData,
              options: {
                ...this.userData.options,
                displayAdultContent: result.userData.options.displayAdultContent
              }
            };
            // Also update in AuthService for shared access
            this.authService.updateUserOptions({
              displayAdultContent: result.userData.options.displayAdultContent
            });
          }
        }
        this.updatingSettings = false;
      },
      error: (err) => {
        console.error('Error updating adult content setting:', err);
        // Revert the toggle on error (create new object to avoid read-only issue)
        if (this.userData?.options) {
          this.userData = {
            ...this.userData,
            options: {
              ...this.userData.options,
              displayAdultContent: !newValue
            }
          };
        }
        this.updatingSettings = false;
      }
    });
  }
}
