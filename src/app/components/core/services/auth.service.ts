import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { User } from 'src/app/models/aniList/responseInterfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'anilist_access_token';
  private userData: User | null = null;

  constructor(private router: Router) {
    // Set up deep link listener for mobile
    if (Capacitor.isNativePlatform()) {
      this.setupDeepLinkListener();
    }
  }

  /**
   * Set up listener for deep link events (mobile only)
   */
  private setupDeepLinkListener(): void {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      console.log('App opened with URL:', event.url);

      // Check if this is our auth callback
      if (event.url.startsWith('animigo://auth/callback')) {
        this.handleDeepLinkCallback(event.url);
      }
    });
  }

  /**
   * Handle deep link callback (mobile)
   */
  private handleDeepLinkCallback(url: string): void {
    console.log('Handling deep link callback:', url);

    // Extract token from URL fragment
    // Format: animigo://auth/callback#access_token=...&token_type=Bearer&expires_in=...
    const hashIndex = url.indexOf('#');
    if (hashIndex === -1) {
      console.error('No hash fragment found in URL');
      this.router.navigate(['/profile']);
      return;
    }

    const hash = url.substring(hashIndex + 1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const expiresIn = params.get('expires_in');

    if (accessToken) {
      this.setToken(accessToken);
      console.log('Token saved from deep link. Expires in:', expiresIn, 'seconds');
      this.router.navigate(['/profile']);
    } else {
      console.error('No access token found in deep link');
      this.router.navigate(['/profile']);
    }
  }

  /**
   * Get the appropriate client ID based on platform
   */
  private getClientId(): string {
    if (Capacitor.isNativePlatform()) {
      // Mobile app uses custom URL scheme
      return environment.anilistClientIdApp;
    } else {
      // Web app - use environment config
      return environment.anilistClientIdWeb;
    }
  }

  /**
   * Initiate AniList OAuth login
   */
  login(): void {
    const clientId = this.getClientId();
    const authUrl = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&response_type=token`;

    console.log('Redirecting to:', authUrl);
    console.log('Client ID:', clientId);

    window.location.href = authUrl;
  }

  /**
   * Handle OAuth callback and extract token
   */
  handleCallback(): boolean {
    // Extract token from URL fragment (#access_token=...)
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const expiresIn = params.get('expires_in');

    if (accessToken) {
      this.setToken(accessToken);
      console.log('Token saved. Expires in:', expiresIn, 'seconds');
      return true;
    }

    return false;
  }

  /**
   * Save access token to storage
   */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Get stored access token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Logout - clear token and user data
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.clearUserData()
    this.router.navigate(['/profile']);
  }

  /**
   * Get authorization header for API requests
   */
  getAuthHeader(): { [key: string]: string } {
    const token = this.getToken();
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
    }
    return {};
  }

  /**
   * Store user data in memory for shared access across components
   * This is especially useful for keeping user options (like displayAdultContent) in sync
   */
  setUserData(user: User): void {
    this.userData = user;
    console.log('User data stored in AuthService:', user);
  }

  /**
   * Get stored user data
   */
  getUserData(): User | null {
    return this.userData;
  }

  /**
   * Update specific user options without replacing entire user object
   */
  updateUserOptions(options: Partial<User['options']>): void {
    if (this.userData) {
      this.userData = {
        ...this.userData,
        options: {
          ...this.userData.options,
          ...options
        }
      };
      console.log('User options updated in AuthService:', this.userData.options);
    }
  }

  /**
   * Clear user data
   */
  clearUserData(): void {
    this.userData = null;
  }
}
