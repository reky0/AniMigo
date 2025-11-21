import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '@components/core/services/api.service';
import { AuthService } from '@components/core/services/auth.service';
import { ToastService } from '@components/core/services/toast.service';
import { LoginPromptComponent } from '@components/molecules/login-prompt/login-prompt.component';
import { MediaListItemComponent } from '@components/molecules/media-list-item/media-list-item.component';
import {
  IonBadge,
  IonCol,
  IonFab,
  IonFabButton,
  IonGrid,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonLabel,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonText
} from '@ionic/angular/standalone';
import { GET_USER_MEDIA_LIST_BY_STATUS } from 'src/app/models/aniList/mediaQueries';
import { MediaListEntry } from 'src/app/models/aniList/responseInterfaces';
import { RangePipe } from "../../../helpers/range.pipe";

type MediaType = 'ANIME' | 'MANGA';
type MediaListStatus = 'CURRENT' | 'PLANNING' | 'COMPLETED' | 'DROPPED' | 'PAUSED' | 'REPEATING';

interface StatusOption {
  value: MediaListStatus;
  label: string;
}

@Component({
  selector: 'am-user-media-collection',
  templateUrl: './user-media-collection.component.html',
  styleUrls: ['./user-media-collection.component.scss'],
  standalone: true,
  imports: [
    IonRefresherContent,
    IonRefresher,
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonText,
    IonCol,
    IonRow,
    IonGrid,
    IonLabel,
    IonSegmentButton,
    IonSegment,
    IonBadge,
    IonFab,
    IonFabButton,
    IonIcon,
    CommonModule,
    FormsModule,
    MediaListItemComponent,
    LoginPromptComponent,
    RangePipe
]
})
export class UserMediaCollectionComponent implements OnInit {
  @Input() mediaType: MediaType = 'ANIME';

  selectedStatus: MediaListStatus = 'CURRENT';
  allMediaList: MediaListEntry[] = []; // Store all loaded entries
  mediaList: MediaListEntry[] = []; // Currently displayed entries
  loading = false;
  isAuthenticated = false;
  isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  private initialLoadComplete = false;

  // Retry counter for getUserData()
  private loadMediaListRetryCount = 0;

  // Pagination for chunked rendering
  private readonly CHUNK_SIZE = 20; // Load 20 items at a time
  private currentChunk = 0;

  // Data cache to store previously loaded data per status
  private dataCache: Map<MediaListStatus, MediaListEntry[]> = new Map();
  statusCounts: Map<MediaListStatus, number> = new Map();

  statusOptions: StatusOption[] = [];

  constructor(
    private readonly toastService: ToastService,
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }

  ngOnInit() {
    this.initializeStatusOptions();
    this.checkAuthAndLoadData();
  }

  private initializeStatusOptions() {
    if (this.mediaType === 'ANIME') {
      this.statusOptions = [
        { value: 'CURRENT', label: 'Watching' },
        { value: 'PLANNING', label: 'Planning' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'PAUSED', label: 'Paused' },
        { value: 'DROPPED', label: 'Dropped' },
        { value: 'REPEATING', label: 'Rewatching' }
      ];
    } else {
      this.statusOptions = [
        { value: 'CURRENT', label: 'Reading' },
        { value: 'PLANNING', label: 'Planning' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'PAUSED', label: 'Paused' },
        { value: 'DROPPED', label: 'Dropped' },
        { value: 'REPEATING', label: 'Rereading' }
      ];
    }
  }

  checkAuthAndLoadData() {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.loadAllStatuses();
    }
  }

  private loadAllStatuses() {
    const userData = this.authService.getUserData();
    if (!userData?.id) {
      if (this.loadMediaListRetryCount < 3) {
        this.loadMediaListRetryCount++;
        setTimeout(() => {
          this.loadAllStatuses();
        }, 300);
        return;
      } else {
        console.error('No user data available after retries');
        this.loadMediaListRetryCount = 0;
        return;
      }
    }

    this.loadMediaListRetryCount = 0;

    // If initial load is already complete, just load the selected status
    if (this.initialLoadComplete) {
      this.loadMediaList();
      return;
    }

    this.loading = true;

    // Load all statuses at once
    const statuses: MediaListStatus[] = ['CURRENT', 'PLANNING', 'COMPLETED', 'PAUSED', 'DROPPED', 'REPEATING'];
    const requests = statuses.map(status =>
      this.apiService.fetchUserMediaListByStatus(
        {
          userId: userData.id,
          type: this.mediaType,
          status: status
        },
        GET_USER_MEDIA_LIST_BY_STATUS,
        false
      )
    );

    // Use Promise.all to wait for all requests
    Promise.all(requests.map(req => req.toPromise())).then(results => {
      results.forEach((result, index) => {
        const status = statuses[index];
        if (result?.data?.MediaListCollection?.lists && result.data.MediaListCollection.lists.length > 0) {
          const entries = [...result.data.MediaListCollection.lists[0].entries].sort((a, b) => {
            return (b.createdAt || 0) - (a.createdAt || 0);
          });
          this.dataCache.set(status, entries);
          this.statusCounts.set(status, entries.length);
        } else {
          this.dataCache.set(status, []);
          this.statusCounts.set(status, 0);
        }
      });

      // Mark initial load as complete
      this.initialLoadComplete = true;

      // Load the current status data into view
      const cachedData = this.dataCache.get(this.selectedStatus)!;
      this.allMediaList = cachedData;
      this.currentChunk = 0;
      this.loadNextChunk();
      this.loading = false;
    }).catch(err => {
      console.error(`Error loading ${this.mediaType.toLowerCase()} list:`, err);
      this.loading = false;
      this.toastService.error(`Failed to load ${this.mediaType.toLowerCase()} list`);
    });
  }

  loadMediaList(forceRefresh: boolean = false) {
    const userData = this.authService.getUserData();
    if (!userData?.id) {
      // User data is not yet available - it may be loading in background
      // Retry after a short delay (up to 3 times)
      if (!this.loadMediaListRetryCount) {
        this.loadMediaListRetryCount = 0;
      }

      if (this.loadMediaListRetryCount < 3) {
        this.loadMediaListRetryCount++;
        setTimeout(() => {
          this.loadMediaList(forceRefresh);
        }, 300); // Wait 300ms before retrying
        return;
      } else {
        console.error('No user data available after retries');
        this.loadMediaListRetryCount = 0; // Reset counter
        return;
      }
    }

    // Reset retry counter on successful call
    this.loadMediaListRetryCount = 0;

    // Check cache first if not forcing refresh
    if (!forceRefresh && this.dataCache.has(this.selectedStatus)) {
      const cachedData = this.dataCache.get(this.selectedStatus)!;
      this.allMediaList = cachedData;
      this.currentChunk = 0;
      this.loadNextChunk();
      return;
    }

    this.loading = true;
    this.apiService.fetchUserMediaListByStatus(
      {
        userId: userData.id,
        type: this.mediaType,
        status: this.selectedStatus
      },
      GET_USER_MEDIA_LIST_BY_STATUS,
      false // Don't show toast for better UX
    ).subscribe({
      next: (result) => {
        if (result.data?.MediaListCollection?.lists && result.data.MediaListCollection.lists.length > 0) {
          // Sort by createdAt timestamp (newer first) - create a copy first to avoid modifying read-only array
          this.allMediaList = [...result.data.MediaListCollection.lists[0].entries].sort((a, b) => {
            return (b.createdAt || 0) - (a.createdAt || 0);
          });
          // Store in cache
          this.dataCache.set(this.selectedStatus, this.allMediaList);
          // Update count for this status
          this.statusCounts.set(this.selectedStatus, this.allMediaList.length);
          // Reset pagination and load first chunk
          this.currentChunk = 0;
          this.loadNextChunk();
        } else {
          this.allMediaList = [];
          this.mediaList = [];
          // Store empty array in cache
          this.dataCache.set(this.selectedStatus, []);
          // Update count for this status
          this.statusCounts.set(this.selectedStatus, 0);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(`Error loading ${this.mediaType.toLowerCase()} list:`, err);
        this.loading = false;
        this.toastService.error(`Failed to load ${this.mediaType.toLowerCase()} list`);
      }
    });
  }

  private loadNextChunk() {
    const startIndex = this.currentChunk * this.CHUNK_SIZE;
    const endIndex = startIndex + this.CHUNK_SIZE;
    const chunk = this.allMediaList.slice(startIndex, endIndex);

    if (this.currentChunk === 0) {
      // First load, replace the list
      this.mediaList = chunk;
    } else {
      // Append to existing list
      this.mediaList = [...this.mediaList, ...chunk];
    }

    this.currentChunk++;
  }

  onIonInfinite(event: any) {
    const startIndex = this.currentChunk * this.CHUNK_SIZE;

    // Check if there are more items to load
    if (startIndex < this.allMediaList.length) {
      this.loadNextChunk();
      event.target.complete();
    } else {
      // No more items to load
      event.target.complete();
      event.target.disabled = true;
    }
  }

  get hasMoreItems(): boolean {
    return this.mediaList.length < this.allMediaList.length;
  }

  get hasDataInCache(): boolean {
    return this.dataCache.has(this.selectedStatus);
  }

  onStatusChange(event: any) {
    this.selectedStatus = event.detail.value;
    this.loadMediaList();
  }

  getMediaWithEntry(entry: MediaListEntry) {
    // Merge the media with its mediaListEntry to provide progress data
    return {
      ...entry.media,
      mediaListEntry: {
        id: entry.id,
        status: entry.status,
        progress: entry.progress,
        progressVolumes: entry.progressVolumes,
        score: entry.score
      }
    };
  }

  goToDetails(entry: MediaListEntry) {
    if (entry.media.isAdult && !this.authService.getUserData()?.options?.displayAdultContent) {
      this.showErrorToast("Oops, your settings don't allow me to show you that! (Adult content warning)")
    } else {
      this.router.navigate(['media', entry.media.type.toLowerCase(), entry.media.id])
    }
  }

  goToLogin() {
    this.authService.login();
  }

  handleRefresh(event: any) {
    // Force refresh by clearing all cache and reloading all statuses
    this.dataCache.clear();
    this.statusCounts.clear();
    this.initialLoadComplete = false;
    this.loadAllStatuses();

    // Complete the refresh after a short delay to ensure smooth animation
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  reloadCurrentTab() {
    // Only refresh the current status tab
    this.dataCache.delete(this.selectedStatus);
    this.loadMediaList(true);
  }

  get emptyStateMessage(): string {
    return this.mediaType === 'ANIME'
      ? "You don't have any anime in this category yet."
      : "You don't have any manga in this category yet.";
  }

  get emptyStateTitle(): string {
    return this.mediaType === 'ANIME' ? 'No anime found' : 'No manga found';
  }

  getStatusCount(status: MediaListStatus): number | null {
    return this.statusCounts.get(status) ?? null;
  }

  private async showErrorToast(message: string) {
    // Use ToastService with alerts for reliable notifications
    await this.toastService.error(message);
  }
}
