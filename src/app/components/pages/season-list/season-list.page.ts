import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogItemComponent } from '@components/atoms/catalog-item/catalog-item.component';
import { ApiService } from '@components/core/services/api.service';
import { AuthService } from '@components/core/services/auth.service';
import { ToastService } from '@components/core/services/toast.service';
import { MediaListItemComponent } from '@components/molecules/media-list-item/media-list-item.component';
import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonChip,
    IonCol,
    IonContent,
    IonFab,
    IonFabButton,
    IonGrid,
    IonHeader,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonLabel,
    IonModal,
    IonRow,
    IonTitle,
    IonToolbar
} from '@ionic/angular/standalone';
import { take } from 'rxjs';
import { AnimeSeason, getNextSeason, getPreferredTitle, getSeasonYear, toSentenceCase } from 'src/app/helpers/utils';
import { GET_MEDIA_LIST } from 'src/app/models/aniList/mediaQueries';
import { SeasonListParams, SeasonalMedia } from 'src/app/models/season-list.interface';
import { RangePipe } from '../../../helpers/range.pipe';

@Component({
  selector: 'am-season-list',
  templateUrl: './season-list.page.html',
  styleUrls: ['./season-list.page.scss'],
  standalone: true,
  imports: [
    IonTitle,
    IonRow,
    IonContent,
    IonHeader,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonGrid,
    IonCol,
    MediaListItemComponent,
    CatalogItemComponent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonFab,
    IonFabButton,
    IonModal,
    IonChip,
    IonLabel,
    RangePipe
  ]
})
export class SeasonListPage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;

  toSentenceCase = toSentenceCase;
  getPreferredTitle = getPreferredTitle;

  mediaEdges: SeasonalMedia[] = [];
  private mediaIdSet = new Set<number>();

  season: AnimeSeason = 'WINTER';
  year: number = new Date().getFullYear();
  page: number = 1;
  perPage: number = 25;
  hasNextPage = true;
  loadingMore = false;

  loading: boolean = true;
  error: any;

  pageTitle: string = '';
  defaultHref: string = '/explore';
  isGridView: boolean = false;
  isFilterModalOpen: boolean = false;

  // Filter options
  availableSeasons: AnimeSeason[] = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];
  availableYears: number[] = [];
  sortOptions = [
    { value: 'POPULARITY_DESC', label: 'Popularity', icon: 'flame-outline' },
    { value: 'SCORE_DESC', label: 'Score', icon: 'star-outline' },
    { value: 'TRENDING_DESC', label: 'Trending', icon: 'trending-up-outline' },
    { value: 'START_DATE_DESC', label: 'Start Date', icon: 'calendar-outline' },
    { value: 'TITLE_ROMAJI', label: 'Title (A-Z)', icon: 'text-outline' },
  ];

  // Selected filters
  selectedSeason: AnimeSeason = 'WINTER';
  selectedYear: number = new Date().getFullYear();
  selectedSort: string = 'POPULARITY_DESC';

  constructor(
    private readonly apiService: ApiService,
    private readonly route: ActivatedRoute,
    private readonly titleService: Title,
    private readonly router: Router,
    public readonly authService: AuthService,
    private readonly toastService: ToastService
  ) {}

  ngOnInit() {
    this.toastService.setTabBarVisibility(false);

    // Initialize available years (current year + 1 down to 1917)
    const currentYear = new Date().getFullYear();
    for (let year = currentYear + 1; year >= 1917; year--) {
      this.availableYears.push(year);
    }

    // Get season and year from route params or use next season
    const params = this.route.snapshot.queryParams as SeasonListParams;

    const nextSeasonInfo = getNextSeason();

    // Validate and set season
    const seasonParam = params.season?.toUpperCase();
    if (seasonParam && this.isValidSeason(seasonParam)) {
      this.season = seasonParam as AnimeSeason;
      // If season is specified, determine the appropriate year based on whether it has passed
      const yearParam = parseInt(params.year || '', 10);
      if (!isNaN(yearParam) && yearParam >= 1940 && yearParam <= 2100) {
        this.year = yearParam;
      } else {
        // No year specified, so calculate the appropriate year for this season
        this.year = getSeasonYear(this.season);
      }
    } else {
      this.season = nextSeasonInfo.season;
      this.year = nextSeasonInfo.year;
    }

    // Set selected filters to match current values
    this.selectedSeason = this.season;
    this.selectedYear = this.year;

    this.updatePageTitle();
    this.loadMore();
  }

  ionViewWillEnter() {
    this.updatePageTitle();
  }

  /**
   * Validates if a string is a valid anime season
   */
  private isValidSeason(season: string): boolean {
    return ['WINTER', 'SPRING', 'SUMMER', 'FALL'].includes(season);
  }

  /**
   * Updates the page title based on current season and year
   */
  private updatePageTitle() {
    const seasonDisplay = this.toSentenceCase(this.season);
    this.pageTitle = `${seasonDisplay} ${this.year} Anime`;
    this.titleService.setTitle(`${this.pageTitle} · AniMigo`);
  }

  /**
   * Navigate to media details page
   */
  goToDetails(id: number, isAdult: boolean | null | undefined) {
    if (isAdult && !this.authService.getUserData()?.options?.displayAdultContent) {
      this.toastService.error(
        "Oops, your settings don't allow me to show you that! (Adult content warning)"
      );
      return;
    }

    setTimeout(() => {
      this.router.navigate(['media', 'anime', id]);
    }, 100);
  }

  /**
   * Load more seasonal anime with pagination
   */
  async loadMore(event?: any) {
    // Prevent multiple simultaneous requests
    if (this.loadingMore) {
      event?.target?.complete();
      return;
    }

    if (!this.hasNextPage) {
      event?.target?.complete();
      if (event) {
        event.target.disabled = true;
      }
      return;
    }

    this.loadingMore = true;

    // Create a unique context for Apollo cache differentiation
    const context = `season_${this.season}_${this.year}`;

    const variables: any = {
      type: 'ANIME',
      page: this.page,
      sort: [this.selectedSort],
      perPage: this.perPage,
      season: this.season,
      seasonYear: this.year,
      context: context
    };

    // Determine if we should hide adult content based on user settings
    const hideAdultContent =
      this.authService.getUserData()?.options?.displayAdultContent !== true;

    // Fetch seasonal anime
    this.apiService
      .search(GET_MEDIA_LIST, variables, true, hideAdultContent)
      .pipe(take(1))
      .subscribe({
        next: ({ data, errors }) => {
          this.loading = false;

          if (!errors) {
            const newEdges = (data?.Page?.media ?? []) as SeasonalMedia[];
            for (const media of newEdges) {
              const id = media?.id;
              if (id && !this.mediaIdSet.has(id)) {
                this.mediaIdSet.add(id);
                this.mediaEdges.push(media);
              }
            }

            const pageInfo = data?.Page?.pageInfo;
            this.page = this.page + 1;
            this.hasNextPage = !!pageInfo?.hasNextPage;
          }

          this.loadingMore = false;
          if (event) {
            event.target.complete();
            if (!this.hasNextPage) {
              event.target.disabled = true;
            }
          }
        },
        error: (err) => {
          this.loading = false;
          this.loadingMore = false;
          this.error = err;
          if (event) {
            event.target.complete();
          }
          this.toastService.error('Failed to load seasonal anime');
        }
      });
  }

  /**
   * Toggle between grid and list view modes
   */
  toggleViewMode() {
    this.isGridView = !this.isGridView;
  }

  /**
   * Open filter modal
   */
  openFilterModal() {
    this.isFilterModalOpen = true;
  }

  /**
   * Close filter modal without applying
   */
  cancelFilters() {
    // Reset to current values
    this.selectedSeason = this.season;
    this.selectedYear = this.year;
    this.isFilterModalOpen = false;
  }

  /**
   * Apply selected filters
   */
  applyFilters() {
    this.isFilterModalOpen = false;

    // Check if filters changed
    const filtersChanged =
      this.selectedSeason !== this.season ||
      this.selectedYear !== this.year ||
      this.selectedSort !== localStorage.getItem('seasonListSort') || 'POPULARITY_DESC';

    if (filtersChanged) {
      // Update current season and year
      this.season = this.selectedSeason;
      this.year = this.selectedYear;

      // Reset pagination
      this.page = 1;
      this.mediaEdges = [];
      this.mediaIdSet.clear();
      this.hasNextPage = true;

      // Update page title and URL
      this.updatePageTitle();
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          season: this.season,
          year: this.year
        },
        queryParamsHandling: 'merge'
      });

      // Load new data
      this.loading = true;
      this.loadMore();

      // Scroll to top
      this.content?.scrollToTop(300);
    }
  }

  /**
   * Get capitalized season name
   */
  getSeasonName(season: AnimeSeason): string {
    return this.toSentenceCase(season);
  }
}
