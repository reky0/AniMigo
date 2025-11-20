import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CatalogItemComponent } from "@components/atoms/catalog-item/catalog-item.component";
import { ApiService } from '@components/core/services/api.service';
import { AuthService } from '@components/core/services/auth.service';
import { PlatformService } from '@components/core/services/platform.service';
import { ToastService } from '@components/core/services/toast.service';
import { CharacterItemComponent } from "@components/molecules/character-item/character-item.component";
import { LoginPromptComponent } from "@components/molecules/login-prompt/login-prompt.component";
import { MediaListItemComponent } from "@components/molecules/media-list-item/media-list-item.component";
import { PersonItemComponent } from "@components/molecules/person-item/person-item.component";
import { MediaStatusStatsComponent } from "@components/organisms/media-status-stats/media-status-stats.component";
import { PeopleInfoTabComponent } from "@components/organisms/people-info-tab/people-info-tab.component";
import { PeopleMediaTabComponent } from "@components/organisms/people-media-tab/people-media-tab.component";
import { PeopleVATabComponent } from "@components/organisms/people-va-tab/people-va-tab.component";
import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardSubtitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonModal, IonProgressBar, IonRow, IonSegment, IonSegmentButton, IonSkeletonText, IonSpinner, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { take } from 'rxjs';
import { getPreferredCharacterName, getPreferredTitle } from 'src/app/helpers/utils';
import { GET_CHARACTER_BY_ID, GET_CURRENT_USER, GET_STAFF_BY_ID, GET_USER_FAVOURITES, GET_USER_PROFILE_DATA, GET_USER_STATUS_COUNTS } from 'src/app/models/aniList/mediaQueries';
import { Character, Staff, User } from 'src/app/models/aniList/responseInterfaces';
import { RangePipe } from "../../../helpers/range.pipe";

@Component({
  selector: 'am-profile-tab',
  templateUrl: './profile-tab.page.html',
  styleUrls: ['./profile-tab.page.scss'],
  standalone: true,
  imports: [IonInfiniteScrollContent, IonInfiniteScroll, IonSegmentButton, IonToolbar, IonHeader, IonModal, IonSkeletonText, IonProgressBar, IonAvatar, IonCardContent, IonCard, IonRow, IonCol, IonGrid, IonIcon, IonButton, IonContent, CommonModule, IonButtons, CatalogItemComponent, IonTitle, IonCardSubtitle, IonSpinner, IonSegment, PeopleInfoTabComponent, PeopleMediaTabComponent, PeopleVATabComponent, MediaListItemComponent, RangePipe, CharacterItemComponent, PersonItemComponent, MediaStatusStatsComponent, LoginPromptComponent]
})
export class ProfileTabPage implements OnInit {
  token: string | null = null;
  userData: User | null = null;
  loading: boolean = false;

  getPreferredTitle = getPreferredTitle;
  getPreferredCharacterName = getPreferredCharacterName;

  // Store accurate status counts for both anime and manga
  actualAnimeStatusCounts = {
    watching: 0,
    completed: 0,
    onHold: 0,
    dropped: 0,
    planToWatch: 0,
    rewatching: 0
  };

  actualMangaStatusCounts = {
    reading: 0,
    completed: 0,
    onHold: 0,
    dropped: 0,
    planToRead: 0,
    rereading: 0
  };

  // Consolidated modal state
  modalState = {
    isOpen: false,
    isFavouritesOpen: false,
    selectedTab: 'info' as 'info' | 'media' | 'va',
    favouriteCategory: 'media' as 'media' | 'people',
    favouriteType: 'anime' as 'anime' | 'manga' | 'characters' | 'staff',
    data: undefined as Character | Staff | undefined,
    isTogglingFavorite: false
  };

  // Pagination state for favourites
  favouritesPagination = {
    anime: {
      currentPage: 0,
      perPage: 25,
      hasNextPage: true,
      loadingMore: false,
      firstLoading: false,
      idSet: new Set<number>()
    },
    manga: {
      currentPage: 0,
      perPage: 25,
      hasNextPage: true,
      loadingMore: false,
      firstLoading: false,
      idSet: new Set<number>()
    },
    characters: {
      currentPage: 0,
      perPage: 25,
      hasNextPage: true,
      loadingMore: false,
      firstLoading: false,
      idSet: new Set<number>()
    },
    staff: {
      currentPage: 0,
      perPage: 25,
      hasNextPage: true,
      loadingMore: false,
      firstLoading: false,
      idSet: new Set<number>()
    }
  };

  error: any;

  isTabletOrAbove = this.platformService.isTabletOrAbove;
  isDesktop = this.platformService.isDesktop;

  constructor(
    public authService: AuthService,
    private apiService: ApiService,
    private router: Router,
    private readonly toastService: ToastService,
    readonly platformService: PlatformService
  ) { }

  ngOnInit() {
    this.toastService.setTabBarVisibility(this.platformService.isHybrid());
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
  }

  loadUserData() {
    if (!this.isAuthenticated) {
      return;
    }

    this.loading = true;
    this.error = null;

    // First get the current user ID
    this.apiService.fetchCurrentUser(GET_CURRENT_USER).subscribe({
      next: (result) => {
        if (result.data?.Viewer) {
          const userId = result.data.Viewer.id;
          // Store user data in AuthService for shared access
          this.authService.setUserData(result.data.Viewer);

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
          // Get the latest user options from AuthService
          const sharedUserData = this.authService.getUserData();

          // Merge full profile data with fresh options from AuthService
          this.userData = {
            ...result.data.User,
            options: sharedUserData?.options ?? result.data.User.options
          };

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
        // Count entries for anime statuses
        this.actualAnimeStatusCounts = {
          watching: this.countEntries(result.data?.animeCurrent),
          completed: this.countEntries(result.data?.animeCompleted),
          onHold: this.countEntries(result.data?.animePaused),
          dropped: this.countEntries(result.data?.animeDropped),
          planToWatch: this.countEntries(result.data?.animePlanning),
          rewatching: this.countEntries(result.data?.animeRepeating)
        };

        // Count entries for manga statuses
        this.actualMangaStatusCounts = {
          reading: this.countEntries(result.data?.mangaCurrent),
          completed: this.countEntries(result.data?.mangaCompleted),
          onHold: this.countEntries(result.data?.mangaPaused),
          dropped: this.countEntries(result.data?.mangaDropped),
          planToRead: this.countEntries(result.data?.mangaPlanning),
          rereading: this.countEntries(result.data?.mangaRepeating)
        };
      },
      error: (err) => {
        console.error('Error loading status counts:', err);
      }
    });
  }

  countEntries(collection: any): number {
    if (!collection?.lists) return 0;
    return collection.lists.reduce((total: number, list: any) => {
      return total + (list.entries?.length ?? 0);
    }, 0);
  }

  // Helper method to get anime status counts
  private getAnimeStatusCounts() {
    // Check if actual counts are populated
    if (Object.values(this.actualAnimeStatusCounts).some(count => count > 0)) {
      return this.actualAnimeStatusCounts;
    }

    // Fallback to statistics
    const statuses = this.userData?.statistics?.anime?.statuses ?? [];
    return {
      watching: statuses.find(s => s.status === 'CURRENT')?.count ?? 0,
      completed: statuses.find(s => s.status === 'COMPLETED')?.count ?? 0,
      onHold: statuses.find(s => s.status === 'PAUSED')?.count ?? 0,
      dropped: statuses.find(s => s.status === 'DROPPED')?.count ?? 0,
      planToWatch: statuses.find(s => s.status === 'PLANNING')?.count ?? 0,
      rewatching: statuses.find(s => s.status === 'REPEATING')?.count ?? 0,
    };
  }

  // Helper method to get manga status counts
  private getMangaStatusCounts() {
    // Check if actual counts are populated
    if (Object.values(this.actualMangaStatusCounts).some(count => count > 0)) {
      return this.actualMangaStatusCounts;
    }

    // Fallback to statistics
    const statuses = this.userData?.statistics?.manga?.statuses ?? [];
    return {
      reading: statuses.find(s => s.status === 'CURRENT')?.count ?? 0,
      completed: statuses.find(s => s.status === 'COMPLETED')?.count ?? 0,
      onHold: statuses.find(s => s.status === 'PAUSED')?.count ?? 0,
      dropped: statuses.find(s => s.status === 'DROPPED')?.count ?? 0,
      planToRead: statuses.find(s => s.status === 'PLANNING')?.count ?? 0,
      rereading: statuses.find(s => s.status === 'REPEATING')?.count ?? 0,
    };
  }

  // Helper method to get total media count
  private getMediaCount(type: 'anime' | 'manga'): number {
    return this.userData?.statistics?.[type]?.count ?? 0;
  }

  login() {
    this.authService.login();
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  // Helper getters for template
  get username(): string {
    return this.userData?.name ?? 'Username';
  }

  get userBio(): string {
    return this.userData?.about ?? '~ Your bio goes here ~';
  }

  get userAvatar(): string | null {
    return this.userData?.avatar?.large ?? this.userData?.avatar?.medium ?? null;
  }

  get userBanner(): string {
    return this.userData?.bannerImage ?? 'assets/images/animigo-logo-banner.jpeg';
  }

  get joinDate(): string {
    if (!this.userData?.createdAt) return 'Maybe joined yesterday';
    const date = new Date(this.userData.createdAt * 1000);
    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    return `Joined ${monthYear}`;
  }

  // Statistics
  get totalAnime(): number {
    return this.getMediaCount('anime');
  }

  get totalManga(): number {
    return this.getMediaCount('manga');
  }

  get watchTime(): string {
    const minutes = this.userData?.statistics?.anime?.minutesWatched ?? 0;
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    return `${days}d ${hours}h`;
  }

  get chaptersRead(): number {
    return this.userData?.statistics?.manga.chaptersRead ?? 0;
  }

  // List status counts
  get animeStatusCounts() {
    return this.getAnimeStatusCounts();
  }

  get mangaStatusCounts() {
    return this.getMangaStatusCounts();
  }

  // Transformed status counts for the media-status-stats component
  get animeStatusCountsForComponent() {
    const counts = this.getAnimeStatusCounts();
    return {
      current: counts.watching,
      completed: counts.completed,
      onHold: counts.onHold,
      dropped: counts.dropped,
      planning: counts.planToWatch,
      repeating: counts.rewatching
    };
  }

  get mangaStatusCountsForComponent() {
    const counts = this.getMangaStatusCounts();
    return {
      current: counts.reading,
      completed: counts.completed,
      onHold: counts.onHold,
      dropped: counts.dropped,
      planning: counts.planToRead,
      repeating: counts.rereading
    };
  }

  // Top genres
  get topGenres() {
    return this.userData?.statistics?.anime?.genres?.slice(0, 5) ?? [];
  }

  // Favorites
  get favoriteAnime() {
    return this.userData?.favourites?.anime?.nodes ?? [];
  }

  get favoriteManga() {
    return this.userData?.favourites?.manga?.nodes ?? [];
  }

  get favoriteCharacters() {
    return this.userData?.favourites?.characters?.nodes ?? [];
  }

  get favoriteStaff() {
    return this.userData?.favourites?.staff?.nodes ?? [];
  }

  get isModalDataStaff(): boolean {
    return this.isStaff(this.modalState.data);
  }

  // TODO: RETRIEVE USER FOLLOWERS AND FOLLOWING DATA IN USER LOGIN PROCESS AND ADD DATA TO USER VARIABLES
  // Social stats (placeholder - would need additional API call)
  get followersCount(): number {
    // AniList doesn't expose follower count in User query, would need separate query
    return this.userData?.followers?.length ?? 0; // Placeholder
  }

  get followingCount(): number {
    // AniList doesn't expose following count in User query, would need separate query
    return this.userData?.following?.length ?? 0; // Placeholder
  }

  goToSettings() {
    this.router.navigate(['settings'])
  }

  goToDetails(data: { id: number, type: string, isAdult: boolean | null | undefined }) {
    if (data.isAdult && !this.authService.getUserData()?.options?.displayAdultContent) {
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

    switch (type) {
      case ('staff'):
        this.apiService.fetchStaffById(GET_STAFF_BY_ID, variables).subscribe({
          next: ({ data, loading, errors }) => {
            this.loading = loading;
            if (errors) {
              this.error = errors[0];
            } else {
              this.modalState.data = data?.Staff;
              this.modalState.isOpen = true;
            }
          },
          error: (err) => {
            this.error = err;
            this.loading = false;
          }
        });
        break;
      case ('character'):
        this.apiService.fetchCharacterById(GET_CHARACTER_BY_ID, variables).subscribe({
          next: ({ data, loading, errors }) => {
            this.loading = loading;
            if (errors) {
              this.error = errors[0];
            } else {
              this.modalState.data = data?.Character;
              this.modalState.isOpen = true;
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
        this.modalState.favouriteCategory = 'media';
        this.modalState.favouriteType = type;
        this.modalState.isFavouritesOpen = true;
        break;
      case ('manga'):
        this.modalState.favouriteCategory = 'media';
        this.modalState.favouriteType = type;
        this.modalState.isFavouritesOpen = true;
        break;
      case ('staff'):
        this.modalState.favouriteCategory = 'people';
        this.modalState.favouriteType = type;
        this.modalState.isFavouritesOpen = true;
        break;
      case ('characters'):
        this.modalState.favouriteCategory = 'people';
        this.modalState.favouriteType = type;
        this.modalState.isFavouritesOpen = true;
        break;
      case ('va'):
        break;
    }

    // Initialize pagination from existing data
    const paginationKey = type as 'anime' | 'manga' | 'characters' | 'staff';
    const existingNodes = this.userData?.favourites?.[paginationKey]?.nodes ?? [];

    // If we have existing data, initialize from it
    if (existingNodes.length > 0) {
      this.favouritesPagination[paginationKey].currentPage = 1; // Already have page 1
      this.favouritesPagination[paginationKey].idSet.clear();

      // Pre-populate idSet with existing IDs to avoid duplicates
      existingNodes.forEach((node: any) => {
        if (node?.id) {
          this.favouritesPagination[paginationKey].idSet.add(node.id);
        }
      });

      // Check if we need to load more (if we have exactly 9 items, there might be more)
      if (existingNodes.length >= 9) {
        this.favouritesPagination[paginationKey].hasNextPage = true;
        // Trigger load of next page
        this.loadMoreFavourites(null);
      } else {
        // We have all the data already
        this.favouritesPagination[paginationKey].hasNextPage = false;
      }
    } else {
      // No existing data, start fresh
      this.favouritesPagination[paginationKey].currentPage = 0;
      this.favouritesPagination[paginationKey].hasNextPage = true;
      this.favouritesPagination[paginationKey].idSet.clear();
      // Trigger initial load
      this.loadMoreFavourites(null);
    }
  }

  async loadMoreFavourites(event: any) {
    const favouriteType = this.modalState.favouriteType as 'anime' | 'manga' | 'characters' | 'staff';
    const pagination = this.favouritesPagination[favouriteType];

    if (pagination.loadingMore || !pagination.hasNextPage || !this.userData?.id) {
      event?.target?.complete();
      return;
    }

    if (event === null) {
      pagination.firstLoading = true;
    }

    pagination.loadingMore = true;

    const variables: any = {
      userId: this.userData.id,
      perPage: pagination.perPage
    };

    // Set the appropriate page parameter based on the type
    switch (favouriteType) {
      case 'anime':
        variables.animePage = pagination.currentPage + 1;
        break;
      case 'manga':
        variables.mangaPage = pagination.currentPage + 1;
        break;
      case 'characters':
        variables.charactersPage = pagination.currentPage + 1;
        break;
      case 'staff':
        variables.staffPage = pagination.currentPage + 1;
        break;
    }

    this.apiService.fetchUserFavorites(GET_USER_FAVOURITES, variables).subscribe({
      next: ({ data, errors }) => {
        if (!errors && data?.User?.favourites) {
          const favouritesData = data.User.favourites[favouriteType];
          const newNodes = favouritesData?.nodes ?? [];
          const pageInfo = favouritesData?.pageInfo;

          // Add unique items to accumulated list
          if (this.userData) {
            // Get or initialize the current nodes array (create a new mutable copy)
            if (!this.userData.favourites) {
              this.userData.favourites = {};
            }

            if (!this.userData.favourites[favouriteType]) {
              this.userData.favourites[favouriteType] = { nodes: [] };
            }

            // Create a new mutable array from existing nodes
            const currentNodes = [...(this.userData.favourites[favouriteType]!.nodes || [])];

            // Add new unique nodes
            for (const node of newNodes) {
              if (node?.id && !pagination.idSet.has(node.id)) {
                pagination.idSet.add(node.id);
                currentNodes.push(node as any); // Type assertion to handle union types
              }
            }

            // Trigger change detection by creating new object
            this.userData = {
              ...this.userData,
              favourites: {
                ...this.userData.favourites,
                [favouriteType]: {
                  nodes: currentNodes
                }
              }
            };
          }

          // Update pagination state
          pagination.currentPage = pageInfo?.currentPage ?? pagination.currentPage + 1;
          pagination.hasNextPage = !!pageInfo?.hasNextPage;
        }

        this.completeLoadMoreFavourites(event, favouriteType);
      },
      error: (err) => {
        console.error('Error loading more favourites:', err);
        this.completeLoadMoreFavourites(event, favouriteType);
      }
    });
  }

  private completeLoadMoreFavourites(event: any, favouriteType: 'anime' | 'manga' | 'characters' | 'staff') {
    const pagination = this.favouritesPagination[favouriteType];
    pagination.loadingMore = false;
    pagination.firstLoading = false;
    event?.target?.complete();
    if (!pagination.hasNextPage && event?.target) {
      event.target.disabled = true;
    }
  }

  closeModal() {
    this.modalState = {
      isOpen: false,
      isFavouritesOpen: false,
      selectedTab: 'info',
      favouriteCategory: 'media',
      favouriteType: 'anime',
      data: undefined,
      isTogglingFavorite: false
    };

    // Reset pagination states when closing favourites modal
    Object.keys(this.favouritesPagination).forEach(key => {
      const paginationKey = key as 'anime' | 'manga' | 'characters' | 'staff';
      this.favouritesPagination[paginationKey].currentPage = 0;
      this.favouritesPagination[paginationKey].hasNextPage = true;
      this.favouritesPagination[paginationKey].loadingMore = false;
      this.favouritesPagination[paginationKey].firstLoading = false;
      this.favouritesPagination[paginationKey].idSet.clear();
    });
  }

  toggleCharacterFavorite() {
    if (!this.modalState.data?.id || this.modalState.isTogglingFavorite) return;

    this.modalState.isTogglingFavorite = true;
    const previousState = this.modalState.data.isFavourite;
    const isStaff = this.isStaff(this.modalState.data);

    const toggleObservable = isStaff
      ? this.apiService.toggleFavoriteStaff(this.modalState.data.id, true, previousState as boolean)
      : this.apiService.toggleFavoriteCharacter(this.modalState.data.id, true, previousState as boolean);

    toggleObservable
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.modalState.isTogglingFavorite = false;
          if (result.success && this.modalState.data) {
            // Update local state by creating a new object
            this.modalState.data = {
              ...this.modalState.data,
              isFavourite: result.isFavorite
            };
          }
        },
        error: () => {
          this.modalState.isTogglingFavorite = false;
        }
      });
  }

  private isStaff(data: Character | Staff | undefined): data is Staff {
    if (!data) return false;
    return 'characters' in data || 'staffMedia' in data;
  }

  private async showErrorToast(message: string) {
    // Use ToastService with alerts for reliable notifications
    await this.toastService.error(message);
  }

  onSegmentChange(event: any) {
    this.modalState.selectedTab = event.detail.value;
  }
}
