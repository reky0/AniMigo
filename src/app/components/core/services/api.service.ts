import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { catchError, map, Observable, take, throwError } from 'rxjs';
import {
  TOGGLE_FAVORITE_CHARACTER,
  TOGGLE_FAVORITE_MEDIA,
  TOGGLE_FAVORITE_STAFF,
  TOGGLE_FAVORITE_STUDIO,
  UPDATE_USER_SETTINGS
} from 'src/app/models/aniList/mutations';
import {
  AiringSchedulesResponse,
  BasicMediaResponse,
  CharacterResponse,
  DetailedMediaResponse,
  FavoriteToggleResult,
  FavoriteType,
  MediaListCollectionResponse,
  SearchResponse,
  UpdateUserResponse,
  UpdateUserSettingsResult,
  UserResponse,
  UserSettingsInput,
  ViewerResponse
} from 'src/app/models/aniList/responseInterfaces';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private readonly apollo: Apollo,
    private readonly authService: AuthService,
    private readonly toastService: ToastService
  ) {}

  fetchBasicData(query: any, variables: Object, displayAdultContent: boolean = false, showToast = true): Observable<{
    data: BasicMediaResponse | null;
    loading: boolean;
    errors?: any;
  }> {
    const queryRef = this.apollo.watchQuery<BasicMediaResponse>({
      query: query,
      variables: variables,
      fetchPolicy: 'cache-and-network',
    });

    return queryRef.valueChanges.pipe(
      map(result => {
        if (result.errors && showToast) {
          const errorMsg = this.formatGraphQLError(result.errors[0], 'Failed to load media data');
          this.showErrorToast(errorMsg);
        }

        // Filter out adult content if displayAdultContent is false
        const filteredData = result.data && !displayAdultContent ? {
          ...result.data,
          Page: {
            ...result.data.Page,
            media: result.data.Page.media.filter(
              media => !media.isAdult
            )
          }
        } : result.data;

        return {
          data: filteredData,
          loading: result.loading,
          errors: result.errors ? result.errors[0] : undefined,
        };
      }),
      catchError(err => {
        if (showToast) {
          const errorMsg = this.formatNetworkError(err, 'Network error loading media data');
          this.showErrorToast(errorMsg);
        }
        return throwError(() => err);
      })
    );
  }

  fetchDetailedData(query: any, variables: Object, showToast = true): Observable<{
    data: DetailedMediaResponse | null;
    loading: boolean;
    errors?: any;
  }> {
    const queryRef = this.apollo.watchQuery<DetailedMediaResponse>({
      query: query,
      variables: variables,
      fetchPolicy: 'cache-and-network',
    });

    return queryRef.valueChanges.pipe(
      map(result => {
        if (result.errors && showToast) {
          const errorMsg = this.formatGraphQLError(result.errors[0], 'Failed to load detailed media data');
          this.showErrorToast(errorMsg);
        }
        return {
          data: result.data,
          loading: result.loading,
          errors: result.errors ? result.errors[0] : undefined,
        };
      }),
      catchError(err => {
        if (showToast) {
          const errorMsg = this.formatNetworkError(err, 'Network error loading detailed data');
          this.showErrorToast(errorMsg);
        }
        return throwError(() => err);
      })
    );
  }

  fetchCharacterById(query: any, variables: Object, showToast = true): Observable<{
    data: CharacterResponse | null;
    loading: boolean;
    errors?: any;
  }> {
    const queryRef = this.apollo.watchQuery<CharacterResponse>({
      query: query,
      variables: variables,
      fetchPolicy: 'cache-and-network',
    });

    return queryRef.valueChanges.pipe(
      map(result => {
        if (result.errors && showToast) {
          const errorMsg = this.formatGraphQLError(result.errors[0], 'Failed to load character data');
          this.showErrorToast(errorMsg);
        }
        return {
          data: result.data,
          loading: result.loading,
          errors: result.errors ? result.errors[0] : undefined,
        };
      }),
      catchError(err => {
        if (showToast) {
          const errorMsg = this.formatNetworkError(err, 'Network error loading character data');
          this.showErrorToast(errorMsg);
        }
        return throwError(() => err);
      })
    );
  }

  fetchCharacterMedia(query: any, variables: Object, showToast = true): Observable<{
    data: any;
    loading: boolean;
    errors?: any;
  }> {
    const queryRef = this.apollo.watchQuery<CharacterResponse>({
      query: query,
      variables: variables,
      fetchPolicy: 'cache-and-network',
    });

    return queryRef.valueChanges.pipe(
      take(1),
      map(result => {
        if (result.errors && showToast) {
          const errorMsg = this.formatGraphQLError(result.errors[0], 'Failed to load character media');
          this.showErrorToast(errorMsg);
        }
        return {
          data: result.data,
          loading: result.loading,
          errors: result.errors ? result.errors[0] : undefined,
        };
      }),
      catchError(err => {
        if (showToast) {
          const errorMsg = this.formatNetworkError(err, 'Network error loading character media');
          this.showErrorToast(errorMsg);
        }
        return throwError(() => err);
      })
    );
  }

  fetchAiringSchedules(query: any, variables: Object, showToast = true, filterAdult = true): Observable<{
    data: AiringSchedulesResponse | null;
    loading: boolean;
    errors?: any;
  }> {
    return this.apollo.query<AiringSchedulesResponse>({
      query: query,
      variables: variables,
      fetchPolicy: 'network-only', // 🔹 always fetch fresh data
    }).pipe(
      map(result => {
        if (result.errors && showToast) {
          const errorMsg = this.formatGraphQLError(result.errors[0], 'Failed to load airing schedules');
          this.showErrorToast(errorMsg);
        }

        // Filter out adult content if filterAdult is true
        const filteredData = result.data && filterAdult ? {
          ...result.data,
          Page: {
            ...result.data.Page,
            airingSchedules: result.data.Page.airingSchedules.filter(
              schedule => !schedule.media?.isAdult
            )
          }
        } : result.data;

        return {
          data: filteredData,
          loading: result.loading,
          errors: result.errors ? result.errors[0] : undefined,
        };
      }),
      catchError(err => {
        if (showToast) {
          const errorMsg = this.formatNetworkError(err, 'Network error loading airing schedules');
          this.showErrorToast(errorMsg);
        }
        return throwError(() => err);
      })
    );
  }

  search(query: any, variables: Object, showToast = true, filterAdult = true): Observable<{
    data: SearchResponse | null;
    loading: boolean;
    errors?: any;
  }> {
    const queryRef = this.apollo.watchQuery<SearchResponse>({
      query: query,
      variables: variables,
      fetchPolicy: 'network-only',
    });

    return queryRef.valueChanges.pipe(
      map(result => {
        if (result.errors && showToast) {
          const errorMsg = this.formatGraphQLError(result.errors[0], 'Failed to load search results');
          this.showErrorToast(errorMsg);
        }

        // Filter out adult content if filterAdult is true
        const filteredData = result.data && filterAdult ? {
          ...result.data,
          Page: {
            ...result.data.Page,
            media: result.data.Page.media?.filter(
              media => !media.isAdult
            )
          }
        } : result.data;

        return {
          data: filteredData,
          loading: result.loading,
          errors: result.errors ? result.errors[0] : undefined,
        };
      }),
      catchError(err => {
        if (showToast) {
          const errorMsg = this.formatNetworkError(err, 'Network error loading search results');
          this.showErrorToast(errorMsg);
        }
        return throwError(() => err);
      })
    );
  }

  // ============================================
  // User Data Methods
  // ============================================

  /**
   * Fetch current authenticated user data
   * @param query - GraphQL query for viewer data
   * @param showToast - Whether to show error toasts
   * @returns Observable with viewer data, loading state, and errors
   */
  fetchCurrentUser(query: any, showToast = true): Observable<{
    data: ViewerResponse | null;
    loading: boolean;
    errors?: any;
  }> {
    return this.apollo.query<ViewerResponse>({
      query: query,
      fetchPolicy: 'network-only',
    }).pipe(
      map(result => {
        if (result.errors && showToast) {
          const errorMsg = this.formatGraphQLError(result.errors[0], 'Failed to load user data');
          this.showErrorToast(errorMsg);
        }
        return {
          data: result.data,
          loading: result.loading,
          errors: result.errors ? result.errors[0] : undefined,
        };
      }),
      catchError(err => {
        if (showToast) {
          const errorMsg = this.formatNetworkError(err, 'Network error loading user data');
          this.showErrorToast(errorMsg);
        }
        return throwError(() => err);
      })
    );
  }

  /**
   * Fetch user data by user ID
   * @param query - GraphQL query for user data
   * @param variables - Variables including userId
   * @param showToast - Whether to show error toasts
   * @returns Observable with user data, loading state, and errors
   */
  fetchUserById(query: any, variables: Object, showToast = true): Observable<{
    data: UserResponse | null;
    loading: boolean;
    errors?: any;
  }> {
    return this.apollo.query<UserResponse>({
      query: query,
      variables: variables,
      fetchPolicy: 'network-only',
    }).pipe(
      map(result => {
        if (result.errors && showToast) {
          const errorMsg = this.formatGraphQLError(result.errors[0], 'Failed to load user profile');
          this.showErrorToast(errorMsg);
        }
        return {
          data: result.data,
          loading: result.loading,
          errors: result.errors ? result.errors[0] : undefined,
        };
      }),
      catchError(err => {
        if (showToast) {
          const errorMsg = this.formatNetworkError(err, 'Network error loading user profile');
          this.showErrorToast(errorMsg);
        }
        return throwError(() => err);
      })
    );
  }

  /**
   * Fetch user's media list collection
   * @param query - GraphQL query for media list
   * @param variables - Variables including userId, type, and optional status
   * @param showToast - Whether to show error toasts
   * @returns Observable with media list data, loading state, and errors
   */
  fetchUserMediaList(query: any, variables: Object, showToast = true): Observable<{
    data: MediaListCollectionResponse | null;
    loading: boolean;
    errors?: any;
  }> {
    return this.apollo.query<MediaListCollectionResponse>({
      query: query,
      variables: variables,
      fetchPolicy: 'network-only',
    }).pipe(
      map(result => {
        if (result.errors && showToast) {
          const errorMsg = this.formatGraphQLError(result.errors[0], 'Failed to load media list');
          this.showErrorToast(errorMsg);
        }
        return {
          data: result.data,
          loading: result.loading,
          errors: result.errors ? result.errors[0] : undefined,
        };
      }),
      catchError(err => {
        if (showToast) {
          const errorMsg = this.formatNetworkError(err, 'Network error loading media list');
          this.showErrorToast(errorMsg);
        }
        return throwError(() => err);
      })
    );
  }

  /**
   * Fetch comprehensive user profile data including statistics and favorites
   * @param query - GraphQL query for complete profile data
   * @param variables - Variables including userId
   * @param showToast - Whether to show error toasts
   * @returns Observable with complete profile data, loading state, and errors
   */
  fetchUserProfileData(query: any, variables: Object, showToast = true): Observable<{
    data: UserResponse | null;
    loading: boolean;
    errors?: any;
  }> {
    return this.apollo.query<UserResponse>({
      query: query,
      variables: variables,
      fetchPolicy: 'network-only',
    }).pipe(
      map(result => {
        if (result.errors && showToast) {
          const errorMsg = this.formatGraphQLError(result.errors[0], 'Failed to load profile data');
          this.showErrorToast(errorMsg);
        }
        return {
          data: result.data,
          loading: result.loading,
          errors: result.errors ? result.errors[0] : undefined,
        };
      }),
      catchError(err => {
        if (showToast) {
          const errorMsg = this.formatNetworkError(err, 'Network error loading profile data');
          this.showErrorToast(errorMsg);
        }
        return throwError(() => err);
      })
    );
  }

  fetchUserFavorites(query: any, variables: Object, showToast = true): Observable<{
    data: UserResponse | null;
    loading: boolean;
    errors?: any;
  }> {
    return this.apollo.query<UserResponse>({
      query: query,
      variables: variables,
      fetchPolicy: 'network-only',
    }).pipe(
      map(result => {
        if (result.errors && showToast) {
          const errorMsg = this.formatGraphQLError(result.errors[0], 'Failed to load favorites');
          this.showErrorToast(errorMsg);
        }
        return {
          data: result.data,
          loading: result.loading,
          errors: result.errors ? result.errors[0] : undefined,
        };
      }),
      catchError(err => {
        if (showToast) {
          const errorMsg = this.formatNetworkError(err, 'Network error loading favorites');
          this.showErrorToast(errorMsg);
        }
        return throwError(() => err);
      })
    );
  }

  private async showErrorToast(message: string) {
    // Use ToastService with alerts for reliable notifications
    await this.toastService.error(message);
  }

  private formatGraphQLError(error: any, friendlyMessage: string): string {
    // AniList GraphQL API error structure
    const status = error?.extensions?.status || error?.status || 'Unknown';
    const message = error?.message || 'No details available';
    const validation = error?.extensions?.validation ? JSON.stringify(error.extensions.validation) : null;

    let errorDetails = `${friendlyMessage}\nStatus: ${status}\nMessage: ${message}`;
    if (validation) {
      errorDetails += `\nValidation: ${validation}`;
    }

    return errorDetails;
  }

  private formatNetworkError(error: any, friendlyMessage: string): string {
    const status = error?.status || error?.statusCode || 'Network Error';
    const message = error?.message || error?.statusText || 'Unable to connect';
    return `${friendlyMessage}\nHTTP ${status}: ${message}`;
  }

  // ============================================
  // Favorite Toggle Methods
  // ============================================

  /**
   * Toggle favorite status for any AniList entity
   * @param id - The ID of the entity to toggle
   * @param type - The type of entity (ANIME, MANGA, CHARACTER, STAFF, STUDIO)
   * @param showToast - Whether to show success/error toasts
   * @returns Observable with toggle result including new favorite status
   */
  toggleFavorite(
    id: number,
    type: FavoriteType,
    showToast = true
  ): Observable<FavoriteToggleResult> {
    const { mutation, variables } = this.prepareFavoriteMutation(id, type);

    return this.apollo.mutate({
      mutation,
      variables
    }).pipe(
      map((result: any) => {
        const favoriteIds = this.extractFavoriteIds(result.data, type);
        const isFavorite = favoriteIds.includes(id);

        if (showToast) {
          this.showFavoriteSuccessToast(isFavorite, type);
        }

        return {
          success: true,
          isFavorite,
          favoriteIds
        };
      }),
      catchError(err => {
        if (showToast) {
          this.showFavoriteErrorToast(err, type);
        }
        return throwError(() => ({
          success: false,
          isFavorite: false,
          favoriteIds: [],
          error: err.message || 'Failed to toggle favorite'
        }));
      })
    );
  }

  /**
   * Toggle favorite for anime
   */
  toggleFavoriteAnime(id: number, showToast = true): Observable<FavoriteToggleResult> {
    return this.toggleFavorite(id, 'ANIME', showToast);
  }

  /**
   * Toggle favorite for manga
   */
  toggleFavoriteManga(id: number, showToast = true): Observable<FavoriteToggleResult> {
    return this.toggleFavorite(id, 'MANGA', showToast);
  }

  /**
   * Toggle favorite for character
   */
  toggleFavoriteCharacter(id: number, showToast = true): Observable<FavoriteToggleResult> {
    return this.toggleFavorite(id, 'CHARACTER', showToast);
  }

  /**
   * Toggle favorite for staff
   */
  toggleFavoriteStaff(id: number, showToast = true): Observable<FavoriteToggleResult> {
    return this.toggleFavorite(id, 'STAFF', showToast);
  }

  /**
   * Toggle favorite for studio
   */
  toggleFavoriteStudio(id: number, showToast = true): Observable<FavoriteToggleResult> {
    return this.toggleFavorite(id, 'STUDIO', showToast);
  }

  /**
   * Toggle favorite for media (auto-detect anime or manga)
   * @param id - Media ID
   * @param mediaType - 'ANIME' or 'MANGA'
   * @param showToast - Whether to show toasts
   */
  toggleFavoriteMedia(
    id: number,
    mediaType: 'ANIME' | 'MANGA',
    showToast = true
  ): Observable<FavoriteToggleResult> {
    return this.toggleFavorite(id, mediaType, showToast);
  }

  // ============================================
  // Private Favorite Helper Methods
  // ============================================

  /**
   * Prepare mutation and variables based on type
   */
  private prepareFavoriteMutation(id: number, type: FavoriteType): { mutation: any, variables: any } {
    switch (type) {
      case 'ANIME':
        return {
          mutation: TOGGLE_FAVORITE_MEDIA,
          variables: { animeId: id }
        };
      case 'MANGA':
        return {
          mutation: TOGGLE_FAVORITE_MEDIA,
          variables: { mangaId: id }
        };
      case 'CHARACTER':
        return {
          mutation: TOGGLE_FAVORITE_CHARACTER,
          variables: { characterId: id }
        };
      case 'STAFF':
        return {
          mutation: TOGGLE_FAVORITE_STAFF,
          variables: { staffId: id }
        };
      case 'STUDIO':
        return {
          mutation: TOGGLE_FAVORITE_STUDIO,
          variables: { studioId: id }
        };
      default:
        throw new Error(`Unsupported favorite type: ${type}`);
    }
  }

  /**
   * Extract favorite IDs from mutation response
   */
  private extractFavoriteIds(data: any, type: FavoriteType): number[] {
    if (!data?.ToggleFavourite) return [];

    switch (type) {
      case 'ANIME':
        return (data.ToggleFavourite.anime?.nodes || []).map((n: any) => n.id);
      case 'MANGA':
        return (data.ToggleFavourite.manga?.nodes || []).map((n: any) => n.id);
      case 'CHARACTER':
        return (data.ToggleFavourite.characters?.nodes || []).map((n: any) => n.id);
      case 'STAFF':
        return (data.ToggleFavourite.staff?.nodes || []).map((n: any) => n.id);
      case 'STUDIO':
        return (data.ToggleFavourite.studios?.nodes || []).map((n: any) => n.id);
      default:
        return [];
    }
  }

  /**
   * Show success toast for favorite toggle
   */
  private async showFavoriteSuccessToast(isFavorite: boolean, type: FavoriteType) {
    const entityName = this.getFavoriteEntityName(type);
    const action = isFavorite ? 'added to' : 'removed from';
    const message = `${entityName} ${action} favorites`;

    // Use ToastService with alerts for reliable notifications
    await this.toastService.success(message);
  }

  /**
   * Show error toast for favorite toggle
   */
  private async showFavoriteErrorToast(error: any, type: FavoriteType) {
    const entityName = this.getFavoriteEntityName(type);
    let message = `Failed to toggle ${entityName.toLowerCase()} favorite`;

    // Check for authentication error
    if (error.message?.includes('authentication') || error.message?.includes('token') || !this.authService.isAuthenticated()) {
      message = 'Please log in to manage favorites';
    }

    // Use ToastService with alerts for reliable notifications
    await this.toastService.error(message);
  }

  /**
   * Get friendly entity name
   */
  private getFavoriteEntityName(type: FavoriteType): string {
    switch (type) {
      case 'ANIME': return 'Anime';
      case 'MANGA': return 'Manga';
      case 'CHARACTER': return 'Character';
      case 'STAFF': return 'Staff';
      case 'STUDIO': return 'Studio';
      default: return 'Item';
    }
  }

  // ============================================
  // User Settings Methods
  // ============================================

  /**
   * Update user settings
   * @param settings - Object containing settings to update (only include fields you want to change)
   * @param showToast - Whether to show success/error toasts
   * @returns Observable with update result including new user data
   *
   * @example
   * // Toggle adult content
   * updateUserSettings({ displayAdultContent: true })
   *
   * @example
   * // Update multiple settings
   * updateUserSettings({
   *   displayAdultContent: false,
   *   titleLanguage: 'ENGLISH',
   *   profileColor: 'purple'
   * })
   */
  updateUserSettings(
    settings: UserSettingsInput,
    showToast = true
  ): Observable<UpdateUserSettingsResult> {
    return this.apollo.mutate<UpdateUserResponse>({
      mutation: UPDATE_USER_SETTINGS,
      variables: settings,
    }).pipe(
      map((result: any) => {
        if (showToast) {
          this.showSettingsSuccessToast();
        }

        return {
          success: true,
          userData: result.data?.UpdateUser
        };
      }),
      catchError(err => {
        if (showToast) {
          this.showSettingsErrorToast(err);
        }
        return throwError(() => ({
          success: false,
          error: err.message || 'Failed to update settings'
        }));
      })
    );
  }

  /**
   * Toggle the displayAdultContent setting
   * @param showAdultContent - New value for displayAdultContent
   * @param showToast - Whether to show success/error toasts
   * @returns Observable with update result
   */
  toggleAdultContent(showAdultContent: boolean, showToast = true): Observable<UpdateUserSettingsResult> {
    return this.updateUserSettings({ displayAdultContent: showAdultContent }, showToast);
  }

  /**
   * Toggle the airingNotifications setting
   * @param enabled - New value for airingNotifications
   * @param showToast - Whether to show success/error toasts
   * @returns Observable with update result
   */
  toggleAiringNotifications(enabled: boolean, showToast = true): Observable<UpdateUserSettingsResult> {
    return this.updateUserSettings({ airingNotifications: enabled }, showToast);
  }

  /**
   * Show success toast for settings update
   */
  private async showSettingsSuccessToast() {
    // Use ToastService with alerts for reliable notifications
    await this.toastService.success('Settings updated successfully');
  }

  /**
   * Show error toast for settings update
   */
  private async showSettingsErrorToast(error: any) {
    let message = 'Failed to update settings';

    // Check for authentication error
    if (error.message?.includes('authentication') || error.message?.includes('token') || !this.authService.isAuthenticated()) {
      message = 'Please log in to update settings';
    }

    // Use ToastService with alerts for reliable notifications
    await this.toastService.error(message);
  }

  clearCache(): void {
    // Clear Apollo cache
    this.apollo.client.clearStore().catch((error) => {
      console.error('Error clearing Apollo cache:', error);
    });
  }
}
