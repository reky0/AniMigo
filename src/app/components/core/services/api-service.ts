import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Apollo} from 'apollo-angular';
import { map } from 'rxjs';
import { Anime, AnimeTheme, AnimeThemesResponse, BasicMediaResponse, DetailedMedia, DetailedMediaResponse, ResourceWithAnime, ThemeData } from 'src/app/models/aniList/responseInterfaces';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private readonly apollo: Apollo,
    private http: HttpClient
  ) { }

  private readonly API_BASE = 'https://api.animethemes.moe';


  fetchBasicData(query: any, variables: Object): Observable<{
    data: BasicMediaResponse | null;
    loading: boolean;
    errors?: any;
  }> {
    const queryRef = this.apollo.watchQuery<BasicMediaResponse>({
      query: query,
      variables: variables
    });

    return queryRef.valueChanges.pipe(
      map(result => ({
        data: result.data,
        loading: result.loading,
        errors: result.errors ? result.errors[0] : undefined,
      }))
    );
  }

  fetchDetailedData(query: any, variables: Object): Observable<{
    data: DetailedMediaResponse | null;
    loading: boolean;
    errors?: any;
  }> {
    const queryRef = this.apollo.watchQuery<DetailedMediaResponse>({
      query: query,
      variables: variables
    });

    return queryRef.valueChanges.pipe(
      map(result => ({
        data: result.data,
        loading: result.loading,
        errors: result.errors ? result.errors[0] : undefined,
      }))
    );
  }

  fetchThemesBySlug(malID: number): Observable<ThemeData[]> {
    const params = new HttpParams()
      .set('include', 'animethemes.song.artists,animethemes.animethemeentries.videos');

    return this.http.get<{ anime: Anime }>(`${this.API_BASE}/anime/${malID}`, { params })
      .pipe(
        retry(2),
        map(response => this.parseAnimeThemes(response.anime)),
        catchError(this.handleError)
      );
  }

  // ============================================
  // PRIVATE HELPER METHODS
  // ============================================

  private parseThemes(response: AnimeThemesResponse): ThemeData[] {
    if (!response.anime || response.anime.length === 0) {
      return [];
    }
    return this.parseAnimeThemes(response.anime[0]);
  }

  private parseAnimeThemes(anime: Anime): ThemeData[] {
    if (!anime.animethemes) {
      return [];
    }

    return anime.animethemes.map(theme => ({
      type: theme.type,
      sequence: theme.sequence,
      fullName: theme.slug,
      songTitle: theme.song?.title || 'Unknown Song',
      artists: theme.song?.artists?.map(a => a.name) || [],
      videoLink: this.extractVideoLink(theme)
    }));
  }

  private extractVideoLink(theme: AnimeTheme): string | undefined {
    if (!theme.animethemeentries || theme.animethemeentries.length === 0) {
      return undefined;
    }

    const firstEntry = theme.animethemeentries[0];
    if (!firstEntry.videos || firstEntry.videos.length === 0) {
      return undefined;
    }

    return firstEntry.videos[0].link;
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}
