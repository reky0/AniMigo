import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { BasicMediaResponse, Character, CharacterResponse, DetailedMediaResponse } from 'src/app/models/aniList/responseInterfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private readonly apollo: Apollo,
  ) { }

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

  fetchCharacterById(query: any, variables: Object): Observable<{
    data: CharacterResponse | null;
    loading: boolean;
    errors?: any;
  }> {
    const queryRef = this.apollo.watchQuery<CharacterResponse>({
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
}
