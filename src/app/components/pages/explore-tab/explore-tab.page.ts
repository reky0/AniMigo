import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InfoChipComponent } from "@components/atoms/info-chip/info-chip.component";
import { ApiService } from '@components/core/services/api.service';
import { AuthService } from '@components/core/services/auth.service';
import { PlatformService } from '@components/core/services/platform.service';
import { ToastService } from '@components/core/services/toast.service';
import { MediaListItemComponent } from "@components/molecules/media-list-item/media-list-item.component";
import { PersonItemComponent } from "@components/molecules/person-item/person-item.component";
import { PeopleInfoTabComponent } from "@components/organisms/people-info-tab/people-info-tab.component";
import { PeopleMediaTabComponent } from "@components/organisms/people-media-tab/people-media-tab.component";
import { PeopleVATabComponent } from "@components/organisms/people-va-tab/people-va-tab.component";
import { IonBadge, IonButton, IonButtons, IonCardSubtitle, IonCheckbox, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonLabel, IonModal, IonRadio, IonRadioGroup, IonRange, IonRow, IonSearchbar, IonSegment, IonSegmentButton, IonSpinner, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { take } from 'rxjs';
import { getPreferredCharacterName } from 'src/app/helpers/utils';
import { GET_GENRES_AND_TAGS, SEARCH_CHARACTER, SEARCH_MEDIA, SEARCH_STAFF } from 'src/app/models/aniList/mediaQueries';
import { Character, Staff } from 'src/app/models/aniList/responseInterfaces';

@Component({
  selector: 'am-explore-tab',
  templateUrl: './explore-tab.page.html',
  styleUrls: ['./explore-tab.page.scss'],
  standalone: true,
  imports: [IonInfiniteScroll, IonSegmentButton, IonSegment, IonButton, IonButtons, IonModal, IonCardSubtitle, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonGrid, IonSearchbar, IonRow, IonCol, InfoChipComponent, IonIcon, IonSpinner, MediaListItemComponent, IonChip, PersonItemComponent, IonInfiniteScrollContent, PeopleInfoTabComponent, PeopleMediaTabComponent, PeopleVATabComponent, IonLabel, IonRange, IonBadge, IonCheckbox, IonRadioGroup, IonRadio]
})
export class ExploreTabPage {
  @ViewChild('searchBar') searchBar!: IonSearchbar;
  @ViewChild('resultsContent') resultsContent!: IonContent;

  getPreferredCharacterName = getPreferredCharacterName;

  isSearchActive = false;
  searchQuery = '';
  storedQuery = '';
  results: any[] = [];

  storedAnimes: any[] = [];
  storedMangas: any[] = [];
  storedCharacters: any[] = [];
  storedStaff: any[] = [];

  resultIds: Set<number> = new Set();
  category: 'anime' | 'manga' | 'characters' | 'staff' = 'anime';
  isSearching = false;
  actualAnimePage = 1;
  actualMangaPage = 1;
  actualCharacterPage = 1;
  actualStaffPage = 1;
  hasNextPage = true;
  isModalOpen: boolean;
  modalSelectedTab: string; // info | media | va
  modalData: Character | Staff | undefined;
  modalDataLoading: boolean = false;
  error: any
  isTogglingFavorite: boolean = false;

  // Filter panel properties
  isFilterPanelOpen = false;
  isFormatsExpanded = false;
  isStatusesExpanded = false;
  isGenresExpanded = false;
  isTagsExpanded = false;
  isSortByExpanded = false;
  currentYear = new Date().getFullYear();

  filters = {
    formats: [] as string[],
    statuses: [] as string[],
    yearRange: { start: 1940, end: this.currentYear + 1 },
    genres: [] as string[],
    tags: [] as string[],
    isBirthday: false,
    sortBy: 'SEARCH_MATCH' as string
  };

  // Track applied filters to detect changes
  appliedFilters = {
    formats: [] as string[],
    statuses: [] as string[],
    yearRange: { start: 1940, end: this.currentYear + 1 },
    genres: [] as string[],
    tags: [] as string[],
    isBirthday: false,
    sortBy: 'SEARCH_MATCH' as string
  };

  get hasUnappliedFilters(): boolean {
    return JSON.stringify(this.filters) !== JSON.stringify(this.appliedFilters);
  }

  // Filter options
  animeFormats = [
    { value: 'TV', label: 'TV' },
    { value: 'TV_SHORT', label: 'TV Short' },
    { value: 'MOVIE', label: 'Movie' },
    { value: 'SPECIAL', label: 'Special' },
    { value: 'OVA', label: 'OVA' },
    { value: 'ONA', label: 'ONA' },
    { value: 'MUSIC', label: 'Music' }
  ];

  mangaFormats = [
    { value: 'MANGA', label: 'Manga' },
    { value: 'LIGHT_NOVEL', label: 'Light Novel' },
    { value: 'ONE_SHOT', label: 'One Shot' },
    { value: 'DOUJIN', label: 'Doujin' },
    { value: 'MANHWA', label: 'Manhwa' },
    { value: 'MANHUA', label: 'Manhua' },
    { value: 'NOVEL', label: 'Novel' }
  ];

  animeStatuses = [
    { value: 'RELEASING', label: 'Airing' },
    { value: 'FINISHED', label: 'Finished' },
    { value: 'NOT_YET_RELEASED', label: 'Not Yet Aired' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  mangaStatuses = [
    { value: 'RELEASING', label: 'Publishing' },
    { value: 'FINISHED', label: 'Finished' },
    { value: 'NOT_YET_RELEASED', label: 'Not Yet Published' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'HIATUS', label: 'Hiatus' }
  ];

  genres: { value: string, label: string }[] = [];
  tags: { name: string, description: string, category: string, isAdult: boolean }[] = [];

  animeSortOptions = [
    { value: 'SEARCH_MATCH', label: 'Best Match', icon: 'search-outline' },
    { value: 'SCORE_DESC', label: 'Score', icon: 'star' },
    { value: 'POPULARITY_DESC', label: 'Popularity', icon: 'stats-chart' },
    { value: 'TRENDING_DESC', label: 'Trending', icon: 'trending-up' },
    { value: 'FAVOURITES_DESC', label: 'Favorites', icon: 'heart' },
    { value: 'START_DATE_DESC', label: 'Newest', icon: 'text-outline' },
    { value: 'TITLE_ROMAJI', label: 'A-Z', icon: 'text' }
  ];

  mangaSortOptions = [
    { value: 'SEARCH_MATCH', label: 'Best Match', icon: 'search-outline' },
    { value: 'SCORE_DESC', label: 'Score', icon: 'star' },
    { value: 'POPULARITY_DESC', label: 'Popularity', icon: 'stats-chart' },
    { value: 'TRENDING_DESC', label: 'Trending', icon: 'trending-up' },
    { value: 'FAVOURITES_DESC', label: 'Favorites', icon: 'heart' },
    { value: 'START_DATE_DESC', label: 'Newest', icon: 'text-outline' },
    { value: 'TITLE_ROMAJI', label: 'A-Z', icon: 'text' }
  ];

  peopleSortOptions = [
    { value: 'SEARCH_MATCH', label: 'Best Match', icon: 'search-outline' },
    { value: 'FAVOURITES_DESC', label: 'Favorites', icon: 'heart' },
    { value: 'RELEVANCE', label: 'Relevance', icon: 'star' }
  ];

  get activeFiltersCount(): number {
    let count = 0;
    count += this.appliedFilters.formats.length;
    count += this.appliedFilters.statuses.length;
    count += this.appliedFilters.genres.length;

    // Check if birthday filter is active
    if (this.appliedFilters.isBirthday) {
      count += 1;
    }

    // Check if year range is not default
    if (this.appliedFilters.yearRange.start !== 1940 || this.appliedFilters.yearRange.end !== this.currentYear + 1) {
      count += 1;
    }

    // Check if sort is not default
    if (this.appliedFilters.sortBy !== 'SEARCH_MATCH') {
      count += 1;
    }

    return count;
  }


  constructor(
    readonly platformService: PlatformService,
    private readonly router: Router,
    private readonly apiService: ApiService,
    readonly authService: AuthService,
    private readonly toastService: ToastService,
  ) {
    this.isModalOpen = false;
    this.modalSelectedTab = 'info';
    this.toastService.setTabBarVisibility(this.platformService.isHybrid());

    // Load genres and tags from API
    this.loadGenresAndTags();
  }

  loadGenresAndTags(): void {
    this.apiService.getGenresAndTags(GET_GENRES_AND_TAGS).subscribe({
      next: ({ data, loading, errors }) => {
        if (errors) {
          console.error('Error loading genres and tags:', errors);
          // Fallback to empty arrays
          this.genres = [];
          this.tags = [];
        } else if (data) {
          // Map genres to our format
          this.genres = (data.genres || []).map((genre: string) => ({
            value: genre,
            label: genre
          }));

          // Store tags as-is
          this.tags = data.tags || [];
        }
      },
      error: (err) => {
        console.error('Error loading genres and tags:', err);
        // Fallback to empty arrays
        this.genres = [];
        this.tags = [];
      }
    });
  }

  activateSearch() {
    this.isSearchActive = true;

    // Restore previous query when opening search overlay
    if (this.storedQuery) {
      this.searchQuery = this.storedQuery;
    }

    setTimeout(() => {
      this.searchBar?.setFocus();
    }, 100);
  }

  deactivateSearch() {

    // Only store the query if it's not empty
    // This prevents overwriting a valid stored query with an empty string
    if (this.searchQuery.trim().length > 0) {
      this.storedQuery = this.searchQuery;
    }

    this.isSearchActive = false;
  }

  onSearchInput(event: any) {
    // Simple assignment - no interference with user typing
    this.searchQuery = event.target.value;
  }

  onEnterPress() {
    if (this.canSearch()) {
      this.performSearch(true);
    }
  }

  canSearch(): boolean {
    // Allow search if there's text with 3+ characters OR if there are active filters
    const hasSearchText = this.searchQuery.trim().length >= 3;
    const hasActiveFilters = this.hasActiveFilters();
    return hasSearchText || hasActiveFilters;
  }

  hasActiveFilters(): boolean {
    return (
      this.appliedFilters.formats.length > 0 ||
      this.appliedFilters.statuses.length > 0 ||
      this.appliedFilters.genres.length > 0 ||
      this.appliedFilters.tags.length > 0 ||
      this.appliedFilters.isBirthday ||
      this.appliedFilters.sortBy !== 'SEARCH_MATCH' ||
      this.appliedFilters.yearRange.start !== 1940 ||
      this.appliedFilters.yearRange.end !== this.currentYear + 1
    );
  }

  triggerContentAnimation() {
    setTimeout(() => {
      this.resultsContent?.scrollToTop(300);
    }, 10);
  }

  changeCategory(newCategory: 'anime' | 'manga' | 'characters' | 'staff') {
    const isNewCategory = this.category !== newCategory;
    const isNewQuery = this.searchQuery !== this.storedQuery;

    let hasDataStored = false;

    switch (newCategory) {
      case 'anime':
        hasDataStored = this.storedAnimes.length > 0;
        break;
      case 'manga':
        hasDataStored = this.storedMangas.length > 0;
        break;
      case 'characters':
        hasDataStored = this.storedCharacters.length > 0;
        break;
      case 'staff':
        hasDataStored = this.storedStaff.length > 0;
        break;
    }

    if (!isNewCategory && !isNewQuery) {
      return;
    }

    // Clear filters when switching between media (anime/manga) and people (characters/staff)
    const oldIsMedia = this.category === 'anime' || this.category === 'manga';
    const newIsMedia = newCategory === 'anime' || newCategory === 'manga';

    if (oldIsMedia !== newIsMedia) {
      this.filters = {
        formats: [],
        statuses: [],
        yearRange: { start: 1940, end: this.currentYear + 1 },
        genres: [],
        tags: [],
        isBirthday: false,
        sortBy: 'SEARCH_MATCH'
      };
    }

    this.category = newCategory;
    this.performSearch((isNewCategory || isNewQuery) && !hasDataStored);
  }

  onIonInfinite(event: any) {
    // Increment the page counter for the current category
    if (this.category === 'anime') {
      this.actualAnimePage += 1;
    } else if (this.category === 'manga') {
      this.actualMangaPage += 1;
    } else if (this.category === 'characters') {
      this.actualCharacterPage += 1;
    } else if (this.category === 'staff') {
      this.actualStaffPage += 1;
    }

    // Perform search with loadingMore flag
    this.performSearch(false, true, event);
  }

  performSearch(newRequest: boolean = false, loadingMore: boolean = false, event: any = null) {
    if (!this.canSearch() || this.isSearching) {
      return;
    }

    // Check if we have cached data for this category
    if (this.storedAnimes.length > 0 && this.category === 'anime' && (!newRequest && !loadingMore)) {
      // Create new array reference to force Angular change detection
      this.results = [...this.storedAnimes];
      this.triggerContentAnimation();
      return;
    }

    if (this.storedMangas.length > 0 && this.category === 'manga' && (!newRequest && !loadingMore)) {
      // Create new array reference to force Angular change detection
      this.results = [...this.storedMangas];
      this.triggerContentAnimation();
      return;
    }

    if (this.storedCharacters.length > 0 && this.category === 'characters' && (!newRequest && !loadingMore)) {
      // Create new array reference to force Angular change detection
      this.results = [...this.storedCharacters];
      this.triggerContentAnimation();
      return;
    }

    if (this.storedStaff.length > 0 && this.category === 'staff' && (!newRequest && !loadingMore)) {
      // Create new array reference to force Angular change detection
      this.results = [...this.storedStaff];
      this.triggerContentAnimation();
      return;
    }

    if (newRequest) {
      this.isSearching = true;
      this.actualAnimePage = 1;
      this.actualMangaPage = 1;
      this.actualCharacterPage = 1;
      this.actualStaffPage = 1;
      this.results = [];
      this.resultIds.clear();

      if (this.searchQuery !== this.storedQuery) {
        this.storedAnimes = [];
        this.storedMangas = [];
        this.storedCharacters = [];
        this.storedStaff = [];
      }
    }

    this.storedQuery = this.searchQuery;

    const queryMap: Record<typeof this.category, typeof SEARCH_MEDIA> = {
      'anime': SEARCH_MEDIA,
      'manga': SEARCH_MEDIA,
      'characters': SEARCH_CHARACTER,
      'staff': SEARCH_STAFF,
    };

    const variablesMap: Record<typeof this.category, any> = {
      'anime': this.buildAnimeVariables(),
      'manga': this.buildMangaVariables(),
      'characters': this.buildCharacterVariables(),
      'staff': this.buildStaffVariables(),
    };

    const query = queryMap[this.category];
    const variables = variablesMap[this.category];

    const displayAdultContent = this.authService.getUserData()?.options?.displayAdultContent === true;
    const filterAdult = !displayAdultContent; // Invert: if we want to display adult, don't filter it

    this.apiService.search(query, variables, true, filterAdult).subscribe({
      next: ({ data, loading, errors }) => {
        const newResults = data?.Page?.media ?? data?.Page?.characters ?? data?.Page?.staff ?? [];
        this.hasNextPage = !!data?.Page?.pageInfo?.hasNextPage;

        // If loading more, append to existing results. Otherwise, replace.
        if (loadingMore) {
          this.results = [...this.results, ...newResults];
        } else {
          this.results = newResults;
        }

        if (data?.Page.media && this.category === 'anime') {
          this.storedAnimes.push(...data.Page.media)
        } else if (data?.Page.media && this.category === 'manga') {
          this.storedMangas.push(...data.Page.media)
        } else if (data?.Page.characters && this.category === 'characters') {
          this.storedCharacters.push(...data.Page.characters)
        } else if (data?.Page.staff && this.category === 'staff') {
          this.storedStaff.push(...data.Page.staff)
        }

        this.isSearching = loading;

        // Trigger animation after new content loads (not for infinite scroll)
        if (!loadingMore) {
          this.triggerContentAnimation();
        }

        event?.target?.complete();
        if (!this.hasNextPage && event?.target) {
          event.target.disabled = true;
        }
      },
      error: (err) => {
        console.error('Search error:', err);
        this.isSearching = false;
        event?.target?.complete();
      }
    });
  }

  navigate(target: string) {
    this.router.navigate([target]);
  }

  navigateToSeason(season: string) {
    const currentYear = new Date().getFullYear();
    this.router.navigate(['/explore/season-list'], {
      queryParams: { season, year: currentYear }
    });
  }

  goToDetails(data: { id: number, type: string, isAdult: boolean }) {
    if (data.isAdult && !this.authService.getUserData()?.options?.displayAdultContent) {
      this.showErrorToast("Oops, your settings don't allow me to show you that! (Adult content warning)")
      return;
    }

    this.closeModal();

    setTimeout(() => {
      this.router.navigate(['media', data.type.toLowerCase(), data.id])
    }, 100);
  }

  // openModal(type: 'staff' | 'character' | 'va', id: number) {
  openModal(type: 'staff' | 'character' | 'va', data: Character | Staff) {
    // let variables = {
    //   id: id
    // }

    this.modalData = data;
    this.isModalOpen = true;

    switch (type) {
      case ('staff'):
        // Staff modal is already handled by setting modalData
        break;
      case ('character'):
        // this.apiService.fetchCharacterById(GET_CHARACTER_BY_ID, variables).subscribe({
        //   next: ({ data, loading, errors }) => {
        //     this.modalDataLoading = loading;
        //     if (errors) {
        //       this.error = errors[0];
        //     } else {
        //       this.modalData = data?.Character;
        //       this.isModalOpen = true;
        //     }
        //   },
        //   error: (err) => {
        //     this.error = err;
        //     this.modalDataLoading = false;
        //   }
        // });
        break;
      case ('va'):
        break;
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.modalSelectedTab = 'info';
  }

  onSegmentChange(event: any) {
    this.modalSelectedTab = event.detail.value as string;
  }

  toggleCharacterFavorite() {
    if (!this.modalData?.id || this.isTogglingFavorite) return;

    this.isTogglingFavorite = true;
    const previousState = this.modalData.isFavourite;

    this.apiService.toggleFavoriteCharacter(this.modalData.id, true, previousState as boolean)
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.isTogglingFavorite = false;
          if (result.success && this.modalData) {
            // Update local state by creating a new object
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

  toggleStaffFavorite() {
    if (!this.modalData?.id || this.isTogglingFavorite) return;

    this.isTogglingFavorite = true;
    const previousState = this.modalData.isFavourite;

    this.apiService.toggleFavoriteStaff(this.modalData.id, true, previousState as boolean)
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.isTogglingFavorite = false;
          if (result.success && this.modalData) {
            // Update local state by creating a new object
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

  isCharacter(data: Character | Staff | undefined): data is Character {
    if (!data) return false;
    return 'media' in data && 'edges' in (data as Character).media;
  }

  // Filter methods
  toggleFilterPanel(): void {
    this.isFilterPanelOpen = !this.isFilterPanelOpen;
  }

  toggleFormatsExpanded(): void {
    this.isFormatsExpanded = !this.isFormatsExpanded;
  }

  toggleStatusesExpanded(): void {
    this.isStatusesExpanded = !this.isStatusesExpanded;
  }

  toggleGenresExpanded(): void {
    this.isGenresExpanded = !this.isGenresExpanded;
  }

  toggleTagsExpanded(): void {
    this.isTagsExpanded = !this.isTagsExpanded;
  }

  toggleSortByExpanded(): void {
    this.isSortByExpanded = !this.isSortByExpanded;
  }

  private buildAnimeVariables(): any {
    const variables: any = {
      page: this.actualAnimePage,
      type: 'ANIME'
    };

    // Only add search parameter if there's a query
    if (this.searchQuery.trim().length > 0) {
      variables.search = this.searchQuery;
    }

    // Only add filter parameters if they have values (use appliedFilters)
    if (this.appliedFilters.formats.length > 0) {
      variables.format_in = this.appliedFilters.formats;
    }

    if (this.appliedFilters.statuses.length > 0) {
      variables.status_in = this.appliedFilters.statuses;
    }

    if (this.appliedFilters.genres.length > 0) {
      variables.genre_in = this.appliedFilters.genres;
    }

    if (this.appliedFilters.tags.length > 0) {
      variables.tag_in = this.appliedFilters.tags;
    }

    // Only add year filters if they're not at default values
    const hasYearFilter = this.appliedFilters.yearRange.start !== 1940 || this.appliedFilters.yearRange.end !== this.currentYear + 1;
    if (hasYearFilter) {
      // Use startDate filters for both anime and manga (works for both)
      variables.startDate_greater = this.appliedFilters.yearRange.start * 10000 + 101; // January 1st
      variables.startDate_lesser = this.appliedFilters.yearRange.end * 10000 + 1231; // December 31st
    }

    // Only add sort if it's not the default
    if (this.appliedFilters.sortBy !== 'SEARCH_MATCH') {
      variables.sort = [this.appliedFilters.sortBy];
    }

    return variables;
  }

  private buildMangaVariables(): any {
    const variables: any = {
      page: this.actualMangaPage,
      type: 'MANGA'
    };

    // Only add search parameter if there's a query
    if (this.searchQuery.trim().length > 0) {
      variables.search = this.searchQuery;
    }

    // Only add filter parameters if they have values (use appliedFilters)
    if (this.appliedFilters.formats.length > 0) {
      variables.format_in = this.appliedFilters.formats;
    }

    if (this.appliedFilters.statuses.length > 0) {
      variables.status_in = this.appliedFilters.statuses;
    }

    if (this.appliedFilters.genres.length > 0) {
      variables.genre_in = this.appliedFilters.genres;
    }

    if (this.appliedFilters.tags.length > 0) {
      variables.tag_in = this.appliedFilters.tags;
    }

    // Only add year filters if they're not at default values
    const hasYearFilter = this.appliedFilters.yearRange.start !== 1940 || this.appliedFilters.yearRange.end !== this.currentYear + 1;
    if (hasYearFilter) {
      // Convert to FuzzyDateInt format (YYYYMMDD)
      variables.startDate_greater = this.appliedFilters.yearRange.start * 10000 + 101; // January 1st
      variables.startDate_lesser = this.appliedFilters.yearRange.end * 10000 + 1231; // December 31st
    }

    // Only add sort if it's not the default
    if (this.appliedFilters.sortBy !== 'SEARCH_MATCH') {
      variables.sort = [this.appliedFilters.sortBy];
    }

    return variables;
  }

  private buildCharacterVariables(): any {
    const variables: any = {
      page: this.actualCharacterPage
    };

    // Only add search parameter if there's a query
    if (this.searchQuery.trim().length > 0) {
      variables.search = this.searchQuery;
    }

    // Only add birthday filter if it's enabled (use appliedFilters)
    if (this.appliedFilters.isBirthday) {
      variables.isBirthday = true;
    }

    // Only add sort if it's not the default
    if (this.appliedFilters.sortBy !== 'SEARCH_MATCH') {
      variables.sort = [this.appliedFilters.sortBy];
    }

    return variables;
  }

  private buildStaffVariables(): any {
    const variables: any = {
      page: this.actualStaffPage
    };

    // Only add search parameter if there's a query
    if (this.searchQuery.trim().length > 0) {
      variables.search = this.searchQuery;
    }

    // Only add birthday filter if it's enabled (use appliedFilters)
    if (this.appliedFilters.isBirthday) {
      variables.isBirthday = true;
    }

    // Only add sort if it's not the default
    if (this.appliedFilters.sortBy !== 'SEARCH_MATCH') {
      variables.sort = [this.appliedFilters.sortBy];
    }

    return variables;
  }

  toggleFilter(filterType: 'formats' | 'statuses' | 'genres' | 'tags', value: string): void {
    const filterArray = this.filters[filterType];
    const index = filterArray.indexOf(value);

    if (index > -1) {
      filterArray.splice(index, 1);
    } else {
      filterArray.push(value);
    }

    // Don't auto-apply filters anymore - wait for user to click "Apply Filters"
  }

  toggleBirthdayFilter(): void {
    this.filters.isBirthday = !this.filters.isBirthday;
    // Don't auto-apply filters anymore - wait for user to click "Apply Filters"
  }

  setFilter(filterType: 'sortBy', value: string): void {
    this.filters[filterType] = value;
    // Don't auto-apply filters anymore - wait for user to click "Apply Filters"
  }

  onYearRangeChange(event: any): void {
    this.filters.yearRange = {
      start: event.detail.value.lower,
      end: event.detail.value.upper
    };
    // Don't auto-apply filters anymore - wait for user to click "Apply Filters"
  }

  clearAllFilters(): void {
    this.filters = {
      formats: [],
      statuses: [],
      yearRange: { start: 1940, end: this.currentYear + 1 },
      genres: [],
      tags: [],
      isBirthday: false,
      sortBy: 'SEARCH_MATCH'
    };
    // Apply immediately when clearing all filters
    this.applyFilters();
  }

  applyFilters(): void {
    // Copy current filters to applied filters
    this.appliedFilters = {
      formats: [...this.filters.formats],
      statuses: [...this.filters.statuses],
      yearRange: { ...this.filters.yearRange },
      genres: [...this.filters.genres],
      tags: [...this.filters.tags],
      isBirthday: this.filters.isBirthday,
      sortBy: this.filters.sortBy
    };

    // Reset stored data when filters change
    this.storedAnimes = [];
    this.storedMangas = [];
    this.storedCharacters = [];
    this.storedStaff = [];

    // Reset pagination
    this.actualAnimePage = 1;
    this.actualMangaPage = 1;
    this.actualCharacterPage = 1;
    this.actualStaffPage = 1;

    // Trigger search with current query and filters (allow filter-only searches)
    if (this.canSearch()) {
      this.performSearch(true);
    }
  }

  private async showErrorToast(message: string) {
    // Use ToastService with alerts for reliable notifications
    await this.toastService.error(message);
  }
}
