import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogItemComponent } from "@components/atoms/catalog-item/catalog-item.component";
import { PlatformService } from '@components/core/services/platform.service';
import { SectionHeaderComponent } from "@components/molecules/section-header/section-header.component";
import { IonCol, IonContent, IonGrid, IonHeader, IonList, IonRefresher, IonRefresherContent, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';

import { Router } from '@angular/router';
import { ApiService } from '@components/core/services/api.service';
import { AuthService } from '@components/core/services/auth.service';
import { ToastService } from '@components/core/services/toast.service';
import { forkJoin } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { RangePipe } from 'src/app/helpers/range.pipe';
import { getNextSeason } from 'src/app/helpers/utils';
import { GET_MEDIA_LIST } from 'src/app/models/aniList/mediaQueries';
import { BasicMedia } from 'src/app/models/aniList/responseInterfaces';

interface DataSection {
  data: BasicMedia[] | null | undefined;
  loading: boolean;
  query: any;
  variables: any;
  key: 'trendingAnimes' | 'nextSeasonAnimes' | 'trendingMangas' | 'newlyAddedAnimes' | 'newlyAddedMangas';
}

@Component({
  selector: 'am-home-tab',
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

  private loadDataRetryCount = 0;
  private readonly MAX_RETRIES = 5;

  private dataSections: DataSection[] = [
    {
      data: null,
      loading: true,
      query: GET_MEDIA_LIST,
      variables: {
        page: 1,
        perPage: 20,
        type: 'ANIME',
        context: "trendingAnimes",
        sort: ['TRENDING_DESC'],
      },
      key: 'trendingAnimes'
    },
    {
      data: null,
      loading: true,
      query: GET_MEDIA_LIST,
      variables: (() => {
        const nextSeason = getNextSeason();
        return {
          page: 1,
          perPage: 20,
          type: 'ANIME',
          sort: ['POPULARITY_DESC'],
          season: nextSeason.season,
          seasonYear: nextSeason.year,
        };
      })(),
      key: 'nextSeasonAnimes'
    },
    {
      data: null,
      loading: true,
      query: GET_MEDIA_LIST,
      variables: {
        page: 1,
        perPage: 20,
        type: 'MANGA',
        context: "trendingMangas",
        sort: ['TRENDING_DESC'],
      },
      key: 'trendingMangas'
    },
    {
      data: null,
      loading: true,
      query: GET_MEDIA_LIST,
      variables: {
        page: 1,
        perPage: 20,
        type: 'ANIME',
        context: "newlyAddedAnimes",
        sort: ['ID_DESC'],
      },
      key: 'newlyAddedAnimes'
    },
    {
      data: null,
      loading: true,
      query: GET_MEDIA_LIST,
      variables: {
        page: 1,
        perPage: 20,
        type: 'MANGA',
        context: "newlyAddedMangas",
        sort: ['ID_DESC'],
      },
      key: 'newlyAddedMangas'
    }
  ];

  constructor(
    private readonly apiService: ApiService,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly toastService: ToastService
  ) { }

  ngOnInit() {
    this.toastService.setTabBarVisibility(this.platformService.isHybrid());
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
    // Check if user is authenticated
    if (this.authService.isAuthenticated()) {
      const userData = this.authService.getUserData();

      // If user data is not yet available, retry with backoff
      if (!userData && this.loadDataRetryCount < this.MAX_RETRIES) {
        this.loadDataRetryCount++;
        setTimeout(() => {
          this.loadAllData();
        }, 200 * this.loadDataRetryCount); // Exponential backoff: 200ms, 400ms, 600ms, etc.
        return;
      }

      // Reset retry counter for future calls
      this.loadDataRetryCount = 0;
    }

    this.fetchData();
  }

  refresh(event: any) {
    this.fetchData(() => event.target.complete());
  }

  private fetchData(onComplete?: () => void) {
    // Create an object of observables for forkJoin
    const requests: { [key: string]: any } = {};
    const displayAdultContent = this.authService.getUserData()?.options?.displayAdultContent === true;

    this.dataSections.forEach(section => {
      this.setLoadingState(section.key, true);

      // Create a copy of variables to avoid mutating the original
      const variables = { ...section.variables };

      if (!displayAdultContent) {
        // Hide adult content
        variables.isAdult = false;
      }
      // If displayAdultContent is true, don't include isAdult parameter (will return all content)

      // Wait for loading to be false before taking the result
      requests[section.key] = this.apiService.fetchBasicData(section.query, variables, displayAdultContent).pipe(
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
            this.setData(section.key, result.data.Page.media);
          }

          // Always set loading to false after processing, as forkJoin completes when all are done
          this.setLoadingState(section.key, false);
        });

        onComplete?.();
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.error = err;
        // Set all loading states to false on error
        this.dataSections.forEach(section => {
          this.setLoadingState(section.key, false);
        });

        onComplete?.();
      }
    });
  }

  goToDetails(id: number, type: 'ANIME' | 'MANGA', isAdult: boolean | null | undefined) {
    if (isAdult && !this.authService.getUserData()?.options?.displayAdultContent) {
      this.showErrorToast("Oops, your settings don't allow me to show you that! (Adult content warning)")
    } else {
      this.router.navigate(['media', type.toLowerCase(), id])
    }
  }

  navigate(target: string) {
    this.router.navigate([target]);
  }

  private async showErrorToast(message: string) {
    // Use ToastService with alerts for reliable notifications
    await this.toastService.error(message);
  }
}
