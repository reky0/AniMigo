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
import { IonButton, IonButtons, IonCardSubtitle, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonModal, IonRow, IonSearchbar, IonSegment, IonSegmentButton, IonSpinner, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, banOutline, checkmark, film, informationCircle, searchOutline, shareSocial, textOutline } from 'ionicons/icons';
import { take } from 'rxjs';
import { SEARCH_CHARACTER, SEARCH_MEDIA } from 'src/app/models/aniList/mediaQueries';
import { Character } from 'src/app/models/aniList/responseInterfaces';

@Component({
  selector: 'am-explore-tab',
  templateUrl: './explore-tab.page.html',
  styleUrls: ['./explore-tab.page.scss'],
  standalone: true,
  imports: [IonInfiniteScroll, IonSegmentButton, IonSegment, IonButton, IonButtons, IonModal, IonCardSubtitle, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonGrid, IonSearchbar, IonRow, IonCol, InfoChipComponent, IonIcon, IonSpinner, MediaListItemComponent, IonChip, PersonItemComponent, IonInfiniteScrollContent, PeopleInfoTabComponent, PeopleMediaTabComponent, PeopleVATabComponent]
})
export class ExploreTabPage {
  @ViewChild('searchBar') searchBar!: IonSearchbar;
  @ViewChild('resultsContent') resultsContent!: IonContent;

  isSearchActive = false;
  searchQuery = '';
  storedQuery = '';
  results: any[] = [];

  storedAnimes: any[] = [];
  storedMangas: any[] = [];
  storedCharacters: any[] = [];

  resultIds: Set<number> = new Set();
  category: 'anime' | 'manga' | 'characters' = 'anime';
  isSearching = false;
  actualAnimePage = 1;
  actualMangaPage = 1;
  actualCharacterPage = 1;

  hasNextPage = true;
  isModalOpen: boolean;
  modalSelectedTab: string; // info | media | va
  modalData: Character | undefined;
  modalDataLoading: boolean = false;
  error: any
  isTogglingFavorite: boolean = false;


  constructor(
    readonly platformService: PlatformService,
    private readonly router: Router,
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
  ) {
    addIcons({ checkmark, searchOutline, textOutline, banOutline, arrowBack, shareSocial, informationCircle, film });

    this.isModalOpen = false;
    this.modalSelectedTab = 'info';
    this.toastService.setTabBarVisibility(this.platformService.isHybrid());
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
    return this.searchQuery.trim().length >= 3;
  }

  triggerContentAnimation() {
    setTimeout(() => {
      this.resultsContent?.scrollToTop(300);
    }, 10);
  }

  changeCategory(newCategory: 'anime' | 'manga' | 'characters') {
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
    }

    if (!isNewCategory && !isNewQuery) {
      return;
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

    if (newRequest) {
      this.isSearching = true;
      this.actualAnimePage = 1;
      this.actualMangaPage = 1;
      this.actualCharacterPage = 1;
      this.results = [];
      this.resultIds.clear();

      if (this.searchQuery !== this.storedQuery) {
        this.storedAnimes = [];
        this.storedMangas = [];
        this.storedCharacters = [];
      }
    }

    this.storedQuery = this.searchQuery;

    const queryMap: Record<typeof this.category, typeof SEARCH_MEDIA> = {
      'anime': SEARCH_MEDIA,
      'manga': SEARCH_MEDIA,
      'characters': SEARCH_CHARACTER,
      // 'staff': SEARCH_MEDIA, // TODO: Replace with SEARCH_STAFF when available
      // 'studios': SEARCH_MEDIA, // TODO: Replace with SEARCH_STUDIOS when available
    };

    const variablesMap: Record<typeof this.category, { page: number, search: string, type?: string }> = {
      'anime': { page: this.actualAnimePage, search: this.searchQuery, type: 'ANIME' },
      'manga': { page: this.actualMangaPage, search: this.searchQuery, type: 'MANGA' },
      'characters': { page: this.actualCharacterPage, search: this.searchQuery },
      // 'staff': {page: this.actualPage, search: this.searchQuery, type: 'STAFF'}, // TODO: Replace with SEARCH_STAFF when available
      // 'studios': {page: this.actualPage, search: this.searchQuery, type: 'STUDIO'}, // TODO: Replace with SEARCH_STUDIOS when available
    };

    const query = queryMap[this.category];
    const variables = variablesMap[this.category];

    this.apiService.search(query, variables, true, this.authService.getUserData()?.options?.displayAdultContent ?? false).subscribe({
      next: ({ data, loading, errors }) => {
        const newResults = data?.Page?.media ?? data?.Page?.characters ?? [];
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
  openModal(type: 'staff' | 'character' | 'va', data: Character) {
    // let variables = {
    //   id: id
    // }

    this.modalData = data;
    this.isModalOpen = true;

    switch (type) {
      case ('staff'):
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

    this.apiService.toggleFavoriteCharacter(this.modalData.id)
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

  private async showErrorToast(message: string) {
    // Use ToastService with alerts for reliable notifications
    await this.toastService.error(message);
  }
}
