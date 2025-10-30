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
import { SEARCH_CHARACTER, SEARCH_MEDIA } from 'src/app/models/aniList/mediaQueries';
import { PersonItemComponent } from "@components/molecules/person-item/person-item.component";

@Component({
  selector: 'app-explore-tab',
  templateUrl: './explore-tab.page.html',
  styleUrls: ['./explore-tab.page.scss'],
  standalone: true,
  imports: [IonInfiniteScroll, IonSegmentButton, IonSegment, IonButton, IonButtons, IonModal, IonCardSubtitle, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonGrid, IonSearchbar, IonRow, IonCol, InfoChipComponent, IonIcon, IonSpinner, MediaListItemComponent, IonChip, PersonItemComponent, IonInfiniteScrollContent]
})
export class ExploreTabPage implements OnInit {
  @ViewChild('searchBar') searchBar!: IonSearchbar;

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

  constructor(
    readonly platformService: PlatformService,
    private readonly router: Router,
    private readonly apiService: ApiService
  ) {
    addIcons({checkmark,searchOutline,textOutline,banOutline,arrowBack,shareSocial,informationCircle,film});
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

    // Perform search with loadingMore flag
    this.performSearch(false, true, event);
  }

  performSearch(newRequest: boolean = false, loadingMore: boolean = false, event: any = null) {
    console.log('search triggered');
    console.log('has event: ', event ? true : false);

    if (!this.canSearch() || this.isSearching) {
      console.log('end search by cannot search or is searching');

      return;
    }

    // Check if we have cached data for this category
    if (this.storedAnimes.length > 0 && this.category === 'anime' && (!newRequest && !loadingMore)) {
      // Create new array reference to force Angular change detection
      this.results = [...this.storedAnimes];
      return;
    }

    if (this.storedMangas.length > 0 && this.category === 'manga' && (!newRequest && !loadingMore)) {
      // Create new array reference to force Angular change detection
      this.results = [...this.storedMangas];
      return;
    }

    if (this.storedCharacters.length > 0 && this.category === 'characters' && (!newRequest && !loadingMore)) {
      // Create new array reference to force Angular change detection
      this.results = [...this.storedCharacters];
      return;
    }

    this.isSearching = true;
    this.storedQuery = this.searchQuery;
    console.log('Performing search for:', this.searchQuery, 'Category:', this.category);

    const queryMap: Record<typeof this.category, typeof SEARCH_MEDIA> = {
      'anime': SEARCH_MEDIA,
      'manga': SEARCH_MEDIA,
      'characters': SEARCH_CHARACTER,
      // 'staff': SEARCH_MEDIA, // TODO: Replace with SEARCH_STAFF when available
      // 'studios': SEARCH_MEDIA, // TODO: Replace with SEARCH_STUDIOS when available
    };

    const variablesMap: Record<typeof this.category, {page: number, search: string, type?: string}> = {
      'anime': {page: this.actualAnimePage, search: this.searchQuery, type: 'ANIME'},
      'manga': {page: this.actualMangaPage, search: this.searchQuery, type: 'MANGA'},
      'characters': {page: this.actualCharacterPage, search: this.searchQuery},
      // 'staff': {page: this.actualPage, search: this.searchQuery, type: 'STAFF'}, // TODO: Replace with SEARCH_STAFF when available
      // 'studios': {page: this.actualPage, search: this.searchQuery, type: 'STUDIO'}, // TODO: Replace with SEARCH_STUDIOS when available
    };

    const query = queryMap[this.category];
    const variables = variablesMap[this.category];

    this.apiService.search(query, variables).subscribe({
      next: ({data, loading ,errors}) => {
        console.log('Search results:', data);

        const newResults = data?.Page?.media ?? data?.Page?.characters ?? [];

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

        this.isSearching = false;
        event?.target?.complete();
        if (!data?.Page.pageInfo.hasNextPage && event?.target) {
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

  goToDetails(data: {id: number, type: string, isAdult: boolean}) {
    // this.closeModal();

    setTimeout(() => {
      this.router.navigate(['media', data.type.toLowerCase(), data.id])
    }, 100);
  }
}
