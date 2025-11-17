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
  IonCol,
  IonGrid,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonLabel,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonText
} from '@ionic/angular/standalone';
import { GET_USER_MEDIA_LIST_BY_STATUS } from 'src/app/models/aniList/mediaQueries';
import { MediaListEntry } from 'src/app/models/aniList/responseInterfaces';

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
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonText,
    IonSpinner,
    IonCol,
    IonRow,
    IonGrid,
    IonLabel,
    IonSegmentButton,
    IonSegment,
    CommonModule,
    FormsModule,
    MediaListItemComponent,
    LoginPromptComponent
  ]
})
export class UserMediaCollectionComponent implements OnInit {
  @Input() mediaType: MediaType = 'ANIME';

  selectedStatus: MediaListStatus = 'CURRENT';
  allMediaList: MediaListEntry[] = []; // Store all loaded entries
  mediaList: MediaListEntry[] = []; // Currently displayed entries
  loading = false;
  isAuthenticated = false;

  // Pagination for chunked rendering
  private readonly CHUNK_SIZE = 20; // Load 20 items at a time
  private currentChunk = 0;

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
      this.loadMediaList();
    }
  }

  loadMediaList() {
    const userData = this.authService.getUserData();
    if (!userData?.id) {
      console.error('No user data available');
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
          this.allMediaList = result.data.MediaListCollection.lists[0].entries;
          // Reset pagination and load first chunk
          this.currentChunk = 0;
          this.loadNextChunk();
        } else {
          this.allMediaList = [];
          this.mediaList = [];
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

  onStatusChange(event: any) {
    this.selectedStatus = event.detail.value;
    this.loadMediaList();
  }

  navigateToDetail(entry: MediaListEntry) {
    const route = this.mediaType === 'ANIME' ? 'anime' : 'manga';
    this.router.navigate([`/${route}`, entry.media.id]);
  }

  goToLogin() {
    this.router.navigate(['/profile']);
  }

  get emptyStateMessage(): string {
    return this.mediaType === 'ANIME'
      ? "You don't have any anime in this category yet."
      : "You don't have any manga in this category yet.";
  }

  get emptyStateTitle(): string {
    return this.mediaType === 'ANIME' ? 'No anime found' : 'No manga found';
  }
}
