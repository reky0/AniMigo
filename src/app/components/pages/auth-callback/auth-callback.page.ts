import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonSpinner } from '@ionic/angular/standalone';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'am-auth-callback',
  templateUrl: './auth-callback.page.html',
  styleUrls: ['./auth-callback.page.scss'],
  standalone: true,
  imports: [CommonModule, IonSpinner, IonContent]
})
export class AuthCallbackPage implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.handleCallback();
  }

  private handleCallback() {
    const success = this.authService.handleCallback();

    if (success) {
      // Redirect to profile or home page
      setTimeout(() => {
        this.router.navigate(['/profile']);
      }, 1000);
    } else {
      console.error('Authentication failed - no token found');
      // Redirect to profile with error
      setTimeout(() => {
        this.router.navigate(['/profile']);
      }, 1000);
    }
  }
}
