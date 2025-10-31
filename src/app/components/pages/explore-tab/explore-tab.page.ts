import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InfoChipComponent } from "@components/atoms/info-chip/info-chip.component";
import { ApiService } from '@components/core/services/api.service';
import { PlatformService } from '@components/core/services/platform.service';
import { IonCol, IonContent, IonGrid, IonHeader, IonRow, IonSearchbar, IonTitle, IonToolbar, IonIcon, IonSpinner, IonChip, IonCardSubtitle, IonModal, IonButtons, IonButton, IonSegment, IonSegmentButton, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { searchOutline, textOutline, checkmark, banOutline, arrowBack, shareSocial, informationCircle, film } from 'ionicons/icons';
import { MediaListItemComponent } from "@components/molecules/media-list-item/media-list-item.component";
import { GET_CHARACTER_BY_ID, SEARCH_CHARACTER, SEARCH_MEDIA } from 'src/app/models/aniList/mediaQueries';
import { PersonItemComponent } from "@components/molecules/person-item/person-item.component";
import { Character } from 'src/app/models/aniList/responseInterfaces';
import { take } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { PeopleInfoTabComponent } from "@components/organisms/people-info-tab/people-info-tab.component";
import { PeopleMediaTabComponent } from "@components/organisms/people-media-tab/people-media-tab.component";
import { PeopleVATabComponent } from "@components/organisms/people-va-tab/people-va-tab.component";
import { AuthService } from '@components/core/services/auth.service';

@Component({
  selector: 'app-explore-tab',
  templateUrl: './explore-tab.page.html',
  styleUrls: ['./explore-tab.page.scss'],
  standalone: true,
  imports: [IonInfiniteScroll, IonSegmentButton, IonSegment, IonButton, IonButtons, IonModal, IonCardSubtitle, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonGrid, IonSearchbar, IonRow, IonCol, InfoChipComponent, IonIcon, IonSpinner, MediaListItemComponent, IonChip, PersonItemComponent, IonInfiniteScrollContent, PeopleInfoTabComponent, PeopleMediaTabComponent, PeopleVATabComponent]
})
export class ExploreTabPage implements OnInit {
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
    private readonly toastController: ToastController,
  ) {
    addIcons({ checkmark, searchOutline, textOutline, banOutline, arrowBack, shareSocial, informationCircle, film });

    this.isModalOpen = false;
    this.modalSelectedTab = 'info';
  }

  ngOnInit() {
  }

  activateSearch() {
    this.isSearchActive = true;

    // Restore previous query when opening search overlay
    if (this.storedQuery) {
      this.searchQuery = this.storedQuery;
    }

    setTimeout(() => {
      this.searchBar?.setFocus();
      console.log('open search bar, query: ' + this.searchQuery);
    }, 100);
  }

  deactivateSearch() {
    console.log('deactivate search bar, query: ' + this.searchQuery);

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
        console.log('stored anime: ', this.storedAnimes);

        hasDataStored = this.storedAnimes.length > 0;
        break;
      case 'manga':
        console.log('stored manga: ', this.storedMangas);

        hasDataStored = this.storedMangas.length > 0;
        break;
      case 'characters':
        console.log('stored characters: ', this.storedCharacters);

        hasDataStored = this.storedCharacters.length > 0;
        break;
    }

    console.log('is new category: ', isNewCategory);
    console.log('is new query: ', isNewQuery);
    console.log('has data stored: ', hasDataStored);


    if (!isNewCategory && !isNewQuery) {
      console.log('blocking duplicate query');

      return;
    }

    this.category = newCategory;
    this.performSearch((isNewCategory || isNewQuery) && !hasDataStored);
  }

  onIonInfinite(event: any) {
    console.log('Infinite scroll triggered');

    // Increment the page counter for the current category
    if (this.category === 'anime') {
      this.actualAnimePage += 1;
    } else if (this.category === 'manga') {
      this.actualMangaPage += 1;
    } else if (this.category === 'characters') {
      this.actualCharacterPage += 1;
    }

    console.log("loading more ", this.category);


    // Perform search with loadingMore flag
    this.performSearch(false, true, event);
  }

  performSearch(newRequest: boolean = false, loadingMore: boolean = false, event: any = null) {
    console.log('search triggered');
    console.log('is new request: ', newRequest);
    console.log('is loading more: ', loadingMore);
    console.log('has event: ', event ? true : false);

    if (!this.canSearch() || this.isSearching) {
      console.log('end search by cannot search or is searching');

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
    console.log('Performing search for:', this.searchQuery, 'Category:', this.category);

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
        console.log('Search results:', data);

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
    console.log('Navigate to:', target);

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

  openModal(type: 'staff' | 'character' | 'va', id: number) {
    console.log('open modal');

    let variables = {
      id: id
    }

    console.log(variables);

    switch (type) {
      case ('staff'):
        break;
      case ('character'):
        this.apiService.fetchCharacterById(GET_CHARACTER_BY_ID, variables).subscribe({
          next: ({ data, loading, errors }) => {
            this.modalDataLoading = loading;
            if (errors) {
              this.error = errors[0];
            } else {
              this.modalData = data?.Character;
              console.log(this.modalData);
              this.isModalOpen = true;
              // console.log(this.data?.description);
            }
          },
          error: (err) => {
            this.error = err;
            this.modalDataLoading = false;
          }
        });
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

    console.log('Modal tab changed to: ' + this.modalSelectedTab);
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
            console.log('fav operation success');

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
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      animated: true,
      icon: 'alert-circle',
      color: 'danger',
      position: 'bottom',
      cssClass: 'multiline-toast', // Add custom class
      swipeGesture: 'vertical'
    });
    console.log(message);

    await toast.present();
  }
}
