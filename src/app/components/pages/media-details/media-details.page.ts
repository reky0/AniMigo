import { CommonModule } from '@angular/common';
import { Component, NgZone, OnDestroy, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CoverImageComponent } from "@components/atoms/cover-image/cover-image.component";
import { InfoChipComponent } from "@components/atoms/info-chip/info-chip.component";
import { MetaItemComponent } from "@components/atoms/meta-item/meta-item.component";
import { SectionTitleComponent } from "@components/atoms/section-title/section-title.component";
import { ApiService } from '@components/core/services/api.service';
import { AuthService } from '@components/core/services/auth.service';
import { PlatformService } from '@components/core/services/platform.service';
import { ToastService } from '@components/core/services/toast.service';
import { CollapsibleComponent } from "@components/molecules/collapsible/collapsible.component";
import { MediaInfo, MediaListEntry, MediaListModalComponent } from '@components/molecules/media-list-modal/media-list-modal.component';
import { InfoTabComponent } from "@components/organisms/info-tab/info-tab.component";
import { PeopleTabComponent } from "@components/organisms/people-tab/people-tab.component";
import { RelationsTabComponent } from "@components/organisms/relations-tab/relations-tab.component";
import { StatsTabComponent } from "@components/organisms/stats-tab/stats-tab.component";
import { IonBackButton, IonBackdrop, IonBadge, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonLabel, IonModal, IonRow, IonSegment, IonSegmentButton, IonSkeletonText, IonSpinner, IonText, IonToolbar } from '@ionic/angular/standalone';
import { Subscription, take } from 'rxjs';
import { getPreferredTitle, toSentenceCase } from 'src/app/helpers/utils';
import { GET_MEDIA_BY_ID } from 'src/app/models/aniList/mediaQueries';
import { DetailedMedia } from 'src/app/models/aniList/responseInterfaces';
import { RangePipe } from "../../../helpers/range.pipe";

@Component({
  selector: 'am-profile-tab',
  templateUrl: './media-details.page.html',
  styleUrls: ['./media-details.page.scss', './media-details-modals.scss'],
  standalone: true,
  imports: [IonLabel, IonSpinner, IonModal, IonSegmentButton, IonSegment, IonBackdrop, IonImg, IonRow, IonGrid, IonIcon, IonBackButton, IonButtons, IonButton, IonSkeletonText, IonCol, IonText, IonContent, IonHeader, IonToolbar, CommonModule, FormsModule, SectionTitleComponent, InfoChipComponent, MetaItemComponent, CoverImageComponent, CollapsibleComponent, MediaListModalComponent, InfoTabComponent, PeopleTabComponent, RelationsTabComponent, StatsTabComponent, RangePipe, IonBadge],
})
export class MediaDetailsPageComponent implements OnDestroy {
  platformService: PlatformService = inject(PlatformService);

  @ViewChild(IonContent, { static: false }) content?: IonContent;

  getPreferredTitle = getPreferredTitle;

  // TODO: ADD MEDIA LIST ADD FUNCTIONALITY ON CATALOG ITEM LONG PRESS (PROJECT-WIDE)
  constructor(
    private readonly apiService: ApiService,
    private readonly toastService: ToastService,
    readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly titleService: Title,
    private readonly ngZone: NgZone
  ) { }

  loading = true;
  error: any;
  data: DetailedMedia | null | undefined = null;
  selectedTab: string = 'info';
  isTogglingFavorite: boolean = false;
  private dataSubscription?: Subscription;

  // FAB state
  isFabOpen: boolean = false;
  showListUpdateModal: boolean = false;
  private longPressTimer: any;
  private isLongPress: boolean = false;

  ionViewWillEnter() {
    this.toastService.setTabBarVisibility(false);
    this.loadMediaData();
  }

  private loadMediaData() {
    const id = this.route.snapshot.paramMap.get("id");
    const type = this.route.snapshot.paramMap.get("type");

    // Reset state when loading new data
    this.loading = true;
    this.error = null;
    this.data = null;

    let variables = {
      id: Number(id),
      type: type?.toUpperCase()
    };

    this.dataSubscription?.unsubscribe();
    this.dataSubscription = this.apiService.fetchDetailedData(GET_MEDIA_BY_ID, variables).subscribe({
      next: ({ data, loading, errors }) => {
        this.loading = loading;
        if (errors) {
          this.error = errors[0];
        } else {
          this.data = data?.Media;

          // Set title after data is loaded
          if (data?.Media) {
            const preferredTitle = getPreferredTitle(data.Media.title, this.authService.getUserData()?.options?.titleLanguage);
            const title = `${preferredTitle} · AniMigo`;
            this.titleService.setTitle(title);
          }
        }
      },
      error: (err) => {
        this.error = err;
        this.loading = false;
      }
    });
  }

  ngOnDestroy() {
    this.dataSubscription?.unsubscribe();
  }

  toSentenceCase = toSentenceCase;

  secondsToDays(seconds: number | null | undefined): number {
    if (!seconds) return -1;

    const secondsPerDay = 24 * 60 * 60; // 86400 seconds in a day
    return Math.floor(seconds / secondsPerDay);
  }

  onSegmentChange(event: any) {
    this.selectedTab = event.detail.value as string;
  }

  selectedImg: string = '';
  showModal = false;

  zoomImg(img: string | null | undefined) {
    this.selectedImg = img || '';
    this.showModal = true;
  }

  onImageError() {
    this.selectedImg = this.selectedImg.replace('large', 'medium');
  }

  closeModal() {
    this.showModal = false;
  }

  toggleMediaFavorite() {
    if (!this.data?.id || this.isTogglingFavorite) return;

    this.isTogglingFavorite = true;
    const previousState = this.data.isFavourite;

    this.apiService.toggleFavoriteMedia(this.data.id, this.data.type, true, previousState as boolean)
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.ngZone.run(() => {
            this.isTogglingFavorite = false;
            if (result.success && this.data) {
              // Update local state with the new state from the API
              this.data = {
                ...this.data,
                isFavourite: result.isFavorite
              };
            }
          });
        },
        error: () => {
          this.ngZone.run(() => {
            this.isTogglingFavorite = false;
          });
        }
      });
  }

  onQuickAction(action: 'planning' | 'completed' | 'watching') {
    if (!this.data?.id) {
      console.error('No media ID available');
      return;
    }

    // Map quick actions to MediaListStatus
    const statusMap = {
      'planning': 'PLANNING',
      'completed': 'COMPLETED',
      'watching': 'CURRENT'
    } as const;

    const newStatus = statusMap[action];

    // Check if the entry already has this status
    if (this.data.mediaListEntry?.status === newStatus) {
      this.isFabOpen = false;
      return;
    }

    // Save the entry with just the status
    this.apiService.saveMediaListEntry({
      mediaId: this.data.id,
      status: newStatus as 'PLANNING' | 'COMPLETED' | 'CURRENT'
    }).subscribe({
      next: (result) => {
        // Update local data with the new entry - create new reference to trigger change detection
        if (result.data && this.data) {
          this.data = {
            ...this.data,
            mediaListEntry: {
              id: result.data.id,
              status: result.data.status,
              score: result.data.score,
              progress: result.data.progress,
              progressVolumes: result.data.progressVolumes,
              repeat: result.data.repeat,
              private: result.data.private,
              hiddenFromStatusLists: result.data.hiddenFromStatusLists,
              notes: result.data.notes,
              startedAt: result.data.startedAt,
              completedAt: result.data.completedAt
            }
          };
        }
        // Close the FAB after successful save
        this.isFabOpen = false;
      },
      error: (error) => {
        console.error('Failed to save quick action:', error);
        // Keep FAB open on error so user can try again
      }
    });
  }

  // Main button handlers (Add to List)
  onMainButtonTouchStart(event: Event) {
    if (!this.platformService.isTouchDevice()) return;
    event.preventDefault();
    // No long press needed for main button, just tap
  }

  onMainButtonTouchEnd(event: Event) {
    if (!this.platformService.isTouchDevice()) return;
    event.preventDefault();
    // Opens modal on touch devices
    this.openDetailedMenu();
  }

  onMainButtonClick() {
    // For non-touch devices (desktop), click opens modal
    if (!this.platformService.isTouchDevice()) {
      this.openDetailedMenu();
    }
  }

  // Toggle button handlers (Quick Actions Arrow)
  onToggleButtonTouchStart(event: Event) {
    if (!this.platformService.isTouchDevice()) return;
    event.preventDefault();
    event.stopPropagation();
  }

  onToggleButtonTouchEnd(event: Event) {
    if (!this.platformService.isTouchDevice()) return;
    event.preventDefault();
    event.stopPropagation();
    // Toggle quick actions visibility
    this.isFabOpen = !this.isFabOpen;
  }

  onToggleButtonClick(event: Event) {
    event.stopPropagation();
    // Toggle quick actions on click
    this.isFabOpen = !this.isFabOpen;
  }

  // Hover functionality disabled for now - uncomment to re-enable
  // onFabContainerMouseEnter() {
  //   // For non-touch devices, hover opens the options automatically
  //   if (!this.platformService.isTouchDevice()) {
  //     this.isFabOpen = true;
  //   }
  // }

  // onFabContainerMouseLeave() {
  //   // For non-touch devices, leaving closes the options
  //   if (!this.platformService.isTouchDevice()) {
  //     this.isFabOpen = false;
  //   }
  // }

  openDetailedMenu() {
    // Safety check: ensure data is loaded
    if (!this.data?.id) {
      console.warn('Cannot open modal: media data not loaded yet');
      return;
    }

    // Collapse the FAB when opening modal
    this.isFabOpen = false;
    this.showListUpdateModal = true;
  }

  closeDetailedMenu() {
    this.showListUpdateModal = false;
  }

  onEntrySaved(entry: MediaListEntry | undefined) {
    // Update local data to reflect changes immediately - create new reference for change detection
    if (this.data) {
      this.data = {
        ...this.data,
        mediaListEntry: entry as any
      };
    }
  }

  isTabletOrAbove(): boolean {
    return this.platformService.isTabletOrAbove();
  }

  isDesktop(): boolean {
    return this.platformService.isDesktop();
  }

  isTouchDevice(): boolean {
    return this.platformService.isTouchDevice();
  }

  getChevronIcon(): string {
    // Desktop: down when closed, up when open (expands downward)
    // Mobile/Tablet: up when closed, down when open (expands upward)
    if (this.isDesktop()) {
      return this.isFabOpen ? 'chevron-up' : 'chevron-down';
    } else {
      return this.isFabOpen ? 'chevron-down' : 'chevron-up';
    }
  }


  // Helper methods for FAB button display
  getMainButtonIcon(): string {
    return this.data?.mediaListEntry ? 'pencil' : 'add';
  }

  getMediaInfo(): MediaInfo | undefined {
    if (!this.data?.id || !this.data?.type) return undefined;
    return {
      id: this.data.id,
      type: this.data.type,
      episodes: this.data.episodes,
      chapters: this.data.chapters,
      volumes: this.data.volumes
    };
  }

  getMainButtonLabel(): string {
    if (!this.data?.mediaListEntry) {
      return 'Add';
    }

    const status = this.data.mediaListEntry.status;
    const isAnime = this.data.type === 'ANIME';

    // Convert status to user-friendly labels
    const statusMap: { [key: string]: string } = {
      'CURRENT': isAnime ? 'Watching' : 'Reading',
      'COMPLETED': 'Completed',
      'PAUSED': 'On Hold',
      'DROPPED': 'Dropped',
      'PLANNING': isAnime ? 'Plan to Watch' : 'Plan to Read',
      'REPEATING': isAnime ? 'Rewatching' : 'Rereading'
    };

    return statusMap[status] || this.toSentenceCase(status);
  }

  deleteEntry() {
    if (!this.data?.mediaListEntry?.id) {
      this.toastService.error('No entry to delete');
      return;
    }

    this.apiService.deleteMediaListEntry(this.data.mediaListEntry.id).subscribe({
      next: () => {
        // Clear local data
        if (this.data) {
          this.data = {
            ...this.data,
            mediaListEntry: undefined
          };
        }
        this.closeDetailedMenu();
      },
      error: (error) => {
        console.error('Failed to delete entry:', error);
      }
    });
  }
}
