import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonButton, IonIcon, IonGrid, IonCol, IonRow, IonCard, IonCardContent, IonAvatar, IonBadge, IonList, IonItem, IonLabel, IonProgressBar, IonSkeletonText, IonButtons, IonText, IonImg, IonCardTitle, IonTitle, IonCardSubtitle, IonModal, IonHeader, IonToolbar, IonSpinner, IonSegmentButton } from '@ionic/angular/standalone';
import { AuthService } from '@components/core/services/auth.service';
import { ApiService } from '@components/core/services/api.service';
import { addIcons } from 'ionicons';
import { logInOutline, logOutOutline, checkmarkCircleOutline, closeCircleOutline, settingsOutline, calendarOutline, chevronForwardOutline, playCircle, star, checkmarkCircle, createOutline, playCircleOutline, pauseCircleOutline, bookmarkOutline, shieldCheckmarkOutline, keyOutline, linkOutline, arrowBack, shareSocial, informationCircle, film } from 'ionicons/icons';
import { GET_CHARACTER_BY_ID, GET_CURRENT_USER, GET_USER_FAVOURITES, GET_USER_PROFILE_DATA, GET_USER_STATUS_COUNTS } from 'src/app/models/aniList/mediaQueries';
import { Character, User } from 'src/app/models/aniList/responseInterfaces';
import { CatalogItemComponent } from "@components/atoms/catalog-item/catalog-item.component";
import { PersonItemComponent } from "@components/molecules/person-item/person-item.component";
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { take } from 'rxjs';
import { IonSegment } from "@ionic/angular/standalone";
import { PeopleInfoTabComponent } from "@components/organisms/people-info-tab/people-info-tab.component";
import { PeopleMediaTabComponent } from "@components/organisms/people-media-tab/people-media-tab.component";
import { PeopleVATabComponent } from "@components/organisms/people-va-tab/people-va-tab.component";
import { MediaListItemComponent } from "@components/molecules/media-list-item/media-list-item.component";
import { RangePipe } from "../../../helpers/range.pipe";

@Component({
  selector: 'app-profile-tab',
  templateUrl: './profile-tab.page.html',
  styleUrls: ['./profile-tab.page.scss'],
  standalone: true,
  imports: [IonSegmentButton, IonToolbar, IonHeader, IonModal, IonSkeletonText, IonProgressBar, IonLabel, IonItem, IonList, IonBadge, IonAvatar, IonCardContent, IonCard, IonRow, IonCol, IonGrid, IonIcon, IonButton, IonContent, CommonModule, IonButtons, CatalogItemComponent, IonCardTitle, IonImg, IonText, PersonItemComponent, IonTitle, IonCardSubtitle, IonSpinner, IonSegment, IonCardSubtitle, PeopleInfoTabComponent, PeopleMediaTabComponent, PeopleVATabComponent, MediaListItemComponent, RangePipe]
})
export class ProfileTabPage implements OnInit {
  token: string | null = null;
  userData: User | null = null;
  loading: boolean = false;

  // Store accurate status counts for both anime and manga
  actualAnimeStatusCounts = {
    watching: 0,
    completed: 0,
    onHold: 0,
    dropped: 0,
    planToWatch: 0
  };

  actualMangaStatusCounts = {
    reading: 0,
    completed: 0,
    onHold: 0,
    dropped: 0,
    planToRead: 0
  };

  isModalOpen: boolean;
  isFavouritesModalOpen: boolean;
  modalSelectedTab: string; // info | media | va
  favouriteCategory: string = 'media';
  favouriteType: string = 'anime';
  modalData: Character | undefined;
  isTogglingFavorite: boolean = false;

  error: any;

  constructor(
    public authService: AuthService,
    private apiService: ApiService,
    private router: Router,
    private readonly toastController: ToastController,
  ) {
    addIcons({ logInOutline, settingsOutline, calendarOutline, playCircleOutline, checkmarkCircleOutline, pauseCircleOutline, closeCircleOutline, bookmarkOutline, arrowBack, shareSocial, informationCircle, film, logOutOutline, chevronForwardOutline, playCircle, star, checkmarkCircle, shieldCheckmarkOutline, keyOutline, linkOutline });

    this.isModalOpen = false;
    this.isFavouritesModalOpen = false;
    this.modalSelectedTab = 'info';
  }

  ngOnInit() {
    this.refreshToken();
    this.loadUserData();
  }

  ionViewWillEnter() {
    this.refreshToken();
    // Always reload data when entering the view if authenticated
    if (this.isAuthenticated) {
      this.loadUserData();
    } else {
      // Clear user data if not authenticated
      this.userData = null;
    }
  }

  refreshToken() {
    this.token = this.authService.getToken();
    console.log('Token refreshed:', this.token ? 'Found' : 'Not found');
  }

  loadUserData() {
    if (!this.isAuthenticated) {
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

          // Now fetch full profile data with favorites
          this.loadFullProfileData(userId);
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

  loadFullProfileData(userId: number) {
    this.apiService.fetchUserProfileData(GET_USER_PROFILE_DATA, { userId }).subscribe({
      next: (result) => {
        if (result.data?.User) {
          this.userData = result.data.User;
          console.log('Full user data loaded:', this.userData);
          console.log('Anime statistics:', this.userData.statistics?.anime);
          console.log('Status breakdown:', this.userData.statistics?.anime?.statuses);
          console.log('Favorite anime:', this.favoriteAnime);

          // Fetch accurate status counts for both anime and manga
          this.loadStatusCounts(userId);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading full profile data:', err);
        this.error = 'Failed to load profile data';
        this.loading = false;
      }
    });
  }

  loadStatusCounts(userId: number) {
    this.apiService.fetchUserMediaList(GET_USER_STATUS_COUNTS, { userId }).subscribe({
      next: (result: any) => {
        console.log('Raw status counts response:', result);

        // Count entries for anime statuses
        this.actualAnimeStatusCounts = {
          watching: this.countEntries(result.data?.animeCurrent),
          completed: this.countEntries(result.data?.animeCompleted),
          onHold: this.countEntries(result.data?.animePaused),
          dropped: this.countEntries(result.data?.animeDropped),
          planToWatch: this.countEntries(result.data?.animePlanning)
        };

        // Count entries for manga statuses
        this.actualMangaStatusCounts = {
          reading: this.countEntries(result.data?.mangaCurrent),
          completed: this.countEntries(result.data?.mangaCompleted),
          onHold: this.countEntries(result.data?.mangaPaused),
          dropped: this.countEntries(result.data?.mangaDropped),
          planToRead: this.countEntries(result.data?.mangaPlanning)
        };

        console.log('Actual anime status counts:', this.actualAnimeStatusCounts);
        console.log('Sum of anime counts:', Object.values(this.actualAnimeStatusCounts).reduce((a: number, b: number) => a + b, 0));
        console.log('Actual manga status counts:', this.actualMangaStatusCounts);
        console.log('Sum of manga counts:', Object.values(this.actualMangaStatusCounts).reduce((a: number, b: number) => a + b, 0));

      },
      error: (err) => {
        console.error('Error loading status counts:', err);
      }
    });
  }

  countEntries(collection: any): number {
    if (!collection?.lists) return 0;
    return collection.lists.reduce((total: number, list: any) => {
      return total + (list.entries?.length || 0);
    }, 0);
  }

  login() {
    console.log('Initiating AniList login...');
    this.authService.login();
  }

  logout() {
    this.authService.logout();
    this.token = null;
    this.userData = null;

    // Reload the page to clear all cached data and reset Apollo cache
    window.location.reload();
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  get tokenPreview() {
    if (!this.token) return 'None';
    return this.token.substring(0, 20) + '...';
  }

  // Helper getters for template
  get username(): string {
    return this.userData?.name || 'Username';
  }

  get userBio(): string {
    return this.userData?.about || '~ Your bio goes here ~';
  }

  get userAvatar(): string | null {
    return this.userData?.avatar?.large || this.userData?.avatar?.medium || null;
  }

  get userBanner(): string {
    return this.userData?.bannerImage || 'assets/images/animigo-logo-banner.jpeg';
  }

  get joinDate(): string {
    if (!this.userData?.createdAt) return 'Maybe joined yesterday';
    const date = new Date(this.userData.createdAt * 1000);
    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    return `Joined ${monthYear}`;
  }

  // Statistics
  get totalAnime(): number {
    return this.userData?.statistics?.anime?.count || 0;
  }

  get totalManga(): number {
    return this.userData?.statistics?.manga?.count || 0;
  }

  get watchTime(): string {
    const minutes = this.userData?.statistics?.anime?.minutesWatched || 0;
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    return `${days}d ${hours}h`;
  }

  get chaptersRead(): number {
    return this.userData?.statistics?.manga.chaptersRead || 0;
  }

  // get meanScoreDisplay(): string {
  //   const score = this.meanScore;
  //   return score > 0 ? (score / 10).toFixed(1) : '0.0';
  // }

  // List status counts
  get animeStatusCounts() {
    // Use actual counts if available, otherwise fall back to statistics
    if (this.actualAnimeStatusCounts.watching > 0 ||
      this.actualAnimeStatusCounts.completed > 0 ||
      this.actualAnimeStatusCounts.onHold > 0 ||
      this.actualAnimeStatusCounts.dropped > 0 ||
      this.actualAnimeStatusCounts.planToWatch > 0) {
      return this.actualAnimeStatusCounts;
    }

    // Fallback to statistics (may be incomplete)
    const statuses = this.userData?.statistics?.anime?.statuses || [];

    return {
      watching: statuses.find(s => s.status === 'CURRENT')?.count || 0,
      completed: statuses.find(s => s.status === 'COMPLETED')?.count || 0,
      onHold: statuses.find(s => s.status === 'PAUSED')?.count || 0,
      dropped: statuses.find(s => s.status === 'DROPPED')?.count || 0,
      planToWatch: statuses.find(s => s.status === 'PLANNING')?.count || 0,
    };
  }

  get mangaStatusCounts() {
    // Use actual counts if available, otherwise fall back to statistics
    if (this.actualMangaStatusCounts.reading > 0 ||
      this.actualMangaStatusCounts.completed > 0 ||
      this.actualMangaStatusCounts.onHold > 0 ||
      this.actualMangaStatusCounts.dropped > 0 ||
      this.actualMangaStatusCounts.planToRead > 0) {
      return this.actualMangaStatusCounts;
    }

    // Fallback to statistics (may be incomplete)
    const statuses = this.userData?.statistics?.manga?.statuses || [];

    return {
      reading: statuses.find(s => s.status === 'CURRENT')?.count || 0,
      completed: statuses.find(s => s.status === 'COMPLETED')?.count || 0,
      onHold: statuses.find(s => s.status === 'PAUSED')?.count || 0,
      dropped: statuses.find(s => s.status === 'DROPPED')?.count || 0,
      planToRead: statuses.find(s => s.status === 'PLANNING')?.count || 0,
    };
  }

  // Top genres
  get topGenres() {
    return this.userData?.statistics?.anime?.genres?.slice(0, 5) || [];
  }

  // Favorites
  get favoriteAnime() {
    return this.userData?.favourites?.anime?.nodes || [];
  }

  get favoriteManga() {
    return this.userData?.favourites?.manga?.nodes || [];
  }

  get favoriteCharacters() {
    return this.userData?.favourites?.characters?.nodes || [];
  }

  // Social stats (placeholder - would need additional API call)
  get followersCount(): number {
    // AniList doesn't expose follower count in User query, would need separate query
    return 0; // Placeholder
  }

  get followingCount(): number {
    // AniList doesn't expose following count in User query, would need separate query
    return 0; // Placeholder
  }

  goToSettings() {
    this.router.navigate(['settings'])
  }

  goToDetails(data: { id: number, type: string, isAdult: boolean | null | undefined }) {
    if (data.isAdult && !this.userData?.options?.displayAdultContent) {
      this.showErrorToast("Oops, your settings don't allow me to show you that! (Adult content warning)")
    } else {

      this.closeModal();

      setTimeout(() => {
        this.router.navigate(['media', data.type.toLowerCase(), data.id])
      }, 100);
    }
  }

  openModal(type: 'staff' | 'character' | 'va', id: number) {
    let variables = {
      id: id
    }

    console.log(variables);

    switch (type) {
      case ('staff'):
        break;
      case ('character'):
        this.apiService.fetchCharacterById(GET_CHARACTER_BY_ID, variables).subscribe({
          next: ({ data, loading, errors }) => {
            this.loading = loading;
            if (errors) {
              this.error = errors[0];
            } else {
              this.modalData = data?.Character;
              console.log(this.modalData);
              this.isModalOpen = true;
              // console.log(this.data?.description);
            }
          },
          error: (err) => {
            this.error = err;
            this.loading = false;
          }
        });
        break;
      case ('va'):
        break;
    }
  }

  openFavouritesModal(type: 'anime' | 'manga' | 'staff' | 'characters' | 'va') {
    switch (type) {
      case ('anime'):
        this.favouriteCategory = 'media';
        this.favouriteType = type;
        this.isFavouritesModalOpen = true;
        break;
      case ('manga'):
        this.favouriteCategory = 'media';
        this.favouriteType = type;
        this.isFavouritesModalOpen = true;
        break;
      case ('staff'):
        break;
      case ('characters'):
        this.favouriteCategory = 'people';
        this.favouriteType = type;
        this.isFavouritesModalOpen = true;
        break;
      case ('va'):
        break;
    }

    this.apiService.fetchUserFavorites(GET_USER_FAVOURITES, { userId: this.userData?.id || 0 }).subscribe({
      next: ({ data, loading, errors }) => {
        this.loading = loading;
        if (errors) {
          this.error = errors[0];
        } else {
          // Append new favorites to existing ones, preventing duplicates
          if (this.userData && data?.User?.favourites) {
            const newFavourites = data.User.favourites;

            // Helper function to merge and deduplicate by ID
            const mergeUnique = <T extends { id: number }>(existing: T[], incoming: T[]): T[] => {
              const existingIds = new Set(existing.map(item => item.id));
              const uniqueIncoming = incoming.filter(item => !existingIds.has(item.id));
              return [...existing, ...uniqueIncoming];
            };

            // Update userData with appended favorites (no duplicates)
            this.userData = {
              ...this.userData,
              favourites: {
                anime: {
                  nodes: mergeUnique(
                    this.userData.favourites?.anime?.nodes || [],
                    newFavourites.anime?.nodes || []
                  )
                },
                manga: {
                  nodes: mergeUnique(
                    this.userData.favourites?.manga?.nodes || [],
                    newFavourites.manga?.nodes || []
                  )
                },
                characters: {
                  nodes: mergeUnique(
                    this.userData.favourites?.characters?.nodes || [],
                    newFavourites.characters?.nodes || []
                  )
                },
                staff: {
                  nodes: mergeUnique(
                    this.userData.favourites?.staff?.nodes || [],
                    newFavourites.staff?.nodes || []
                  )
                }
              }
            };

            console.log('Appended favourites (no duplicates):', this.userData.favourites);
          }
        }
      },
      error: (err) => {
        this.error = err;
        this.loading = false;
      }
    });

  }

  closeModal() {
    this.isModalOpen = false;
    this.isFavouritesModalOpen = false;
    this.modalSelectedTab = 'info';
    this.favouriteCategory = 'media';
  }

  onSegmentChange(event: any) {
    this.modalSelectedTab = event.detail.value as string;

    console.log('Modal tab changed to: ' + this.modalSelectedTab);
  }

  toggleCharacterFavorite() {
    if (!this.modalData?.id || this.isTogglingFavorite) return;

    this.isTogglingFavorite = true;

    this.apiService.toggleFavoriteCharacter(this.modalData.id)
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.isTogglingFavorite = false;
          if (result.success && this.modalData) {
            // Update local state by creating a new object
            console.log('fav operation success');

            this.modalData = {
              ...this.modalData,
              isFavourite: result.isFavorite
            };
          }
        },
        error: () => {
          this.isTogglingFavorite = false;
        }
      });
  }

  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      animated: true,
      icon: 'alert-circle',
      color: 'danger',
      position: 'bottom',
      cssClass: 'multiline-toast', // Add custom class
      swipeGesture: 'vertical'
    });
    console.log(message);

    await toast.present();
  }
}

