import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { catchError, map, Observable, take, throwError } from 'rxjs';
import { BasicMediaResponse, CharacterResponse, DetailedMediaResponse } from 'src/app/models/aniList/responseInterfaces';
import { ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { alertCircle } from 'ionicons/icons';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private readonly apollo: Apollo,
    private readonly toastController: ToastController,
  ) {
    addIcons({alertCircle})
  }

  fetchBasicData(query: any, variables: Object, showToast = true): Observable<{
    data: BasicMediaResponse | null;
    loading: boolean;
    errors?: any;
  }> {
    const queryRef = this.apollo.watchQuery<BasicMediaResponse>({
      query: query,
      variables: variables
    });

    return queryRef.valueChanges.pipe(
      map(result => {
        if (result.errors && showToast) {
          const errorMsg = this.formatGraphQLError(result.errors[0], 'Failed to load media data');
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
      variables: variables
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
      variables: variables
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

  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 5000,
      animated: true,
      icon: 'alert-circle',
      color: 'danger',
      position: 'bottom',
      cssClass: 'multiline-toast', // Add custom class
    });
    console.log(message);

    await toast.present();
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
}
