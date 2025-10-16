import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogItemComponent } from "@components/atoms/catalog-item/catalog-item.component";
import { PlatformService } from '@components/core/services/platform-service';
import { SectionHeaderComponent } from "@components/molecules/section-header/section-header.component";
import { IonCol, IonContent, IonHeader, IonList, IonTitle, IonToolbar } from '@ionic/angular/standalone';

import { Router } from '@angular/router';
import { ApiService } from '@components/core/services/api-service';
import { GET_NEWLY_ADDED_ANIMES, GET_NEWLY_ADDED_MANGAS, GET_NEXT_SEASON_ANIMES, GET_TRENDING_ANIMES, GET_TRENDING_MANGAS } from 'src/app/models/aniList/mediaQueries';
import { BasicMedia } from 'src/app/models/aniList/responseInterfaces';
import { RangePipe } from 'src/app/helpers/range.pipe';

@Component({
  selector: 'app-home-tab',
  templateUrl: './home-tab.page.html',
  styleUrls: ['./home-tab.page.scss'],
  standalone: true,
  imports: [IonList, IonContent, IonTitle, IonToolbar, CommonModule, FormsModule, IonHeader, SectionHeaderComponent, CatalogItemComponent, IonCol, RangePipe]
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


  constructor(private readonly apiService: ApiService, private readonly router: Router) { }

  ngOnInit() {
    let trendingAnimesVariables = {
      page: 1,
      perPage: 20,
      isAdult: false
    };

    let nextSeasonAnimesVariables = {
      page: 1,
      perPage: 20,
      season: "WINTER",
      seasonYear: 2026,
      isAdult: false
    };

    let trendingMangasVariables = {
      page: 1,
      perPage: 20,
      isAdult: false
    };

    let newlyAddedAnimesVariables = {
      page: 1,
      perPage: 20,
      isAdult: false
    };

    let newlyAddedMangasVariables = {
      page: 1,
      perPage: 20,
      isAdult: false
    };

    this.apiService.fetchBasicData(GET_TRENDING_ANIMES, trendingAnimesVariables).subscribe({
      next: ({ data, loading, errors }) => {
        this.trendingAnimesLoading = loading;
        if (errors) {
          this.error = errors[0];
        } else {
          this.trendingAnimes = data?.Page.media;
        }
      },
      error: (err) => {
        this.error = err;
        this.trendingAnimesLoading = false;
      }
    });

    this.apiService.fetchBasicData(GET_NEXT_SEASON_ANIMES, nextSeasonAnimesVariables).subscribe({
      next: ({ data, loading, errors }) => {
        this.nextSeasonAnimesLoading = loading;
        if (errors) {
          this.error = errors[0];
        } else {
          this.nextSeasonAnimes = data?.Page.media;
        }
      },
      error: (err) => {
        this.error = err;
        this.nextSeasonAnimesLoading = false;
      }
    });

    this.apiService.fetchBasicData(GET_TRENDING_MANGAS, trendingMangasVariables).subscribe({
      next: ({ data, loading, errors }) => {
        this.trendingMangasLoading = loading;
        if (errors) {
          this.error = errors[0];
        } else {
          this.trendingMangas = data?.Page.media;
        }
      },
      error: (err) => {
        this.error = err;
        this.trendingMangasLoading = false;
      }
    });

    this.apiService.fetchBasicData(GET_NEWLY_ADDED_ANIMES, newlyAddedAnimesVariables).subscribe({
      next: ({ data, loading, errors }) => {
        this.newlyAddedAnimesLoading = loading;
        if (errors) {
          this.error = errors[0];
        } else {
          this.newlyAddedAnimes = data?.Page.media;
        }
      },
      error: (err) => {
        this.error = err;
        this.newlyAddedAnimesLoading = false;
      }
    });

    this.apiService.fetchBasicData(GET_NEWLY_ADDED_MANGAS, newlyAddedMangasVariables).subscribe({
      next: ({ data, loading, errors }) => {
        this.newlyAddedMangasLoading = loading;
        if (errors) {
          this.error = errors[0];
        } else {
          this.newlyAddedMangas = data?.Page.media;
        }
      },
      error: (err) => {
        this.error = err;
        this.newlyAddedMangasLoading = false;
      }
    });
  }

  goToDetails(id: number, type: 'ANIME' | 'MANGA') {
    this.router.navigate(['media', type.toLowerCase(), id])
  }
}
