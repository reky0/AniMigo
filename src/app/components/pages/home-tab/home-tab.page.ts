import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogItemComponent } from "@components/atoms/catalog-item/catalog-item.component";
import { PlatformService } from '@components/core/services/platform.service';
import { SectionHeaderComponent } from "@components/molecules/section-header/section-header.component";
import { IonCol, IonContent, IonHeader, IonList, IonTitle, IonToolbar, IonGrid, IonRow, IonRefresherContent, IonRefresher } from '@ionic/angular/standalone';

import { Router } from '@angular/router';
import { ApiService } from '@components/core/services/api.service';
import { GET_NEWLY_ADDED_MEDIA, GET_NEXT_SEASON_ANIMES, GET_TRENDING_MEDIA } from 'src/app/models/aniList/mediaQueries';
import { BasicMedia } from 'src/app/models/aniList/responseInterfaces';
import { RangePipe } from 'src/app/helpers/range.pipe';
import { forkJoin } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

interface DataSection {
  data: BasicMedia[] | null | undefined;
  loading: boolean;
  query: any;
  variables: any;
  key: 'trendingAnimes' | 'nextSeasonAnimes' | 'trendingMangas' | 'newlyAddedAnimes' | 'newlyAddedMangas';
}

@Component({
  selector: 'app-home-tab',
  templateUrl: './home-tab.page.html',
  styleUrls: ['./home-tab.page.scss'],
  standalone: true,
  imports: [IonRefresher, IonRefresherContent, IonList, IonContent, IonTitle, IonToolbar, CommonModule, FormsModule, IonHeader, SectionHeaderComponent, CatalogItemComponent, IonCol, RangePipe, IonGrid, IonRow]
})
export class HomeTabPage implements OnInit {
  platformService: PlatformService = inject(PlatformService);

  loadItems = 10;

  trendingAnimes: BasicMedia[] | null | undefined = null;
  trendingAnimesLoading = true;

  nextSeasonAnimes: BasicMedia[] | null | undefined = null;
  nextSeasonAnimesLoading = true;

  trendingMangas: BasicMedia[] | null | undefined = null;
  trendingMangasLoading = true;

  newlyAddedAnimes: BasicMedia[] | null | undefined = null;
  newlyAddedAnimesLoading = true;

  newlyAddedMangas: BasicMedia[] | null | undefined = null;
  newlyAddedMangasLoading = true;

  error: any;

  private dataSections: DataSection[] = [
    {
      data: null,
      loading: true,
      query: GET_TRENDING_MEDIA,
      variables: {
        page: 1,
        perPage: 20,
        isAdult: false,
        type: 'ANIME',
        context: "trendingAnimes",
        sort: 'TRENDING_DESC',
      },
      key: 'trendingAnimes'
    },
    {
      data: null,
      loading: true,
      query: GET_NEXT_SEASON_ANIMES,
      variables: {
        page: 1,
        perPage: 20,
        season: "WINTER",
        seasonYear: 2026,
        isAdult: false
      },
      key: 'nextSeasonAnimes'
    },
    {
      data: null,
      loading: true,
      query: GET_TRENDING_MEDIA,
      variables: {
        page: 1,
        perPage: 20,
        isAdult: false,
        type: 'MANGA',
        context: "trendingMangas",
        sort: 'TRENDING_DESC',
      },
      key: 'trendingMangas'
    },
    {
      data: null,
      loading: true,
      query: GET_NEWLY_ADDED_MEDIA,
      variables: {
        page: 1,
        perPage: 20,
        isAdult: false,
        type: 'ANIME',
        context: "newlyAddedAnimes",
        sort: 'ID_DESC',
      },
      key: 'newlyAddedAnimes'
    },
    {
      data: null,
      loading: true,
      query: GET_NEWLY_ADDED_MEDIA,
      variables: {
        page: 1,
        perPage: 20,
        isAdult: false,
        type: 'MANGA',
        context: "newlyAddedMangas",
        sort: 'ID_DESC',
      },
      key: 'newlyAddedMangas'
    }
  ];

  constructor(private readonly apiService: ApiService, private readonly router: Router) { }

  ngOnInit() {
    this.loadAllData();
  }

  private setLoadingState(key: DataSection['key'], loading: boolean) {
    switch (key) {
      case 'trendingAnimes':
        this.trendingAnimesLoading = loading;
        break;
      case 'nextSeasonAnimes':
        this.nextSeasonAnimesLoading = loading;
        break;
      case 'trendingMangas':
        this.trendingMangasLoading = loading;
        break;
      case 'newlyAddedAnimes':
        this.newlyAddedAnimesLoading = loading;
        break;
      case 'newlyAddedMangas':
        this.newlyAddedMangasLoading = loading;
        break;
    }
  }

  private setData(key: DataSection['key'], data: BasicMedia[] | null | undefined) {
    switch (key) {
      case 'trendingAnimes':
        this.trendingAnimes = data;
        break;
      case 'nextSeasonAnimes':
        this.nextSeasonAnimes = data;
        break;
      case 'trendingMangas':
        this.trendingMangas = data;
        break;
      case 'newlyAddedAnimes':
        this.newlyAddedAnimes = data;
        break;
      case 'newlyAddedMangas':
        this.newlyAddedMangas = data;
        break;
    }
  }

  private loadAllData() {
    // Create an object of observables for forkJoin
    const requests: { [key: string]: any } = {};

    this.dataSections.forEach(section => {
      this.setLoadingState(section.key, true);
      // Wait for loading to be false before taking the result
      requests[section.key] = this.apiService.fetchBasicData(section.query, section.variables).pipe(
        filter(result => !result.loading),
        take(1)
      );
    });

    forkJoin(requests).subscribe({
      next: (results: any) => {
        // Process all results
        this.dataSections.forEach(section => {
          const result = results[section.key];

          console.log(`Loading ${section.key}:`, {
            hasErrors: !!result.errors,
            hasData: !!result.data,
            loading: result.loading,
            mediaCount: result.data?.Page?.media?.length
          });

          if (result.errors) {
            this.error = result.errors[0];
          } else {
            this.setData(section.key, result.data?.Page.media);
          }

          // Always set loading to false after processing, as forkJoin completes when all are done
          this.setLoadingState(section.key, false);
        });
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.error = err;
        // Set all loading states to false on error
        this.dataSections.forEach(section => {
          this.setLoadingState(section.key, false);
        });
      }
    });
  }

  goToDetails(id: number, type: 'ANIME' | 'MANGA') {
    this.router.navigate(['media', type.toLowerCase(), id])
  }

  refresh(event: any) {
    // Create an object of observables for forkJoin
    const requests: { [key: string]: any } = {};

    this.dataSections.forEach(section => {
      this.setLoadingState(section.key, true);
      // Wait for loading to be false before taking the result
      requests[section.key] = this.apiService.fetchBasicData(section.query, section.variables).pipe(
        filter(result => !result.loading),
        take(1)
      );
    });

    forkJoin(requests).subscribe({
      next: (results: any) => {
        // Process all results
        this.dataSections.forEach(section => {
          const result = results[section.key];

          if (result.errors) {
            this.error = result.errors[0];
          } else {
            this.setData(section.key, result.data?.Page.media);
          }

          // Always set loading to false after processing, as forkJoin completes when all are done
          this.setLoadingState(section.key, false);
        });

        // Complete the refresher after all data is loaded
        event.target.complete();
      },
      error: (err) => {
        this.error = err;
        // Set all loading states to false on error
        this.dataSections.forEach(section => {
          this.setLoadingState(section.key, false);
        });

        // Complete the refresher even on error
        event.target.complete();
      }
    });
  }
}
