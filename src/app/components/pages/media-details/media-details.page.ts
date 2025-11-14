import { CommonModule } from '@angular/common';
import { Component, NgZone, OnDestroy, inject } from '@angular/core';
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
import { InfoTabComponent } from "@components/organisms/info-tab/info-tab.component";
import { PeopleTabComponent } from "@components/organisms/people-tab/people-tab.component";
import { RelationsTabComponent } from "@components/organisms/relations-tab/relations-tab.component";
import { StatsTabComponent } from "@components/organisms/stats-tab/stats-tab.component";
import { IonBackButton, IonBackdrop, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonDatetime, IonGrid, IonHeader, IonIcon, IonImg, IonLabel, IonModal, IonRow, IonSegment, IonSegmentButton, IonSkeletonText, IonSpinner, IonText, IonTextarea, IonToggle, IonToolbar } from '@ionic/angular/standalone';
import { Subscription, take } from 'rxjs';
import { toSentenceCase } from 'src/app/helpers/utils';
import { GET_MEDIA_BY_ID } from 'src/app/models/aniList/mediaQueries';
import { DetailedMedia } from 'src/app/models/aniList/responseInterfaces';
import { RangePipe } from "../../../helpers/range.pipe";

@Component({
  selector: 'am-profile-tab',
  templateUrl: './media-details.page.html',
  styleUrls: ['./media-details.page.scss'],
  standalone: true,
  imports: [IonTextarea, IonDatetime, IonToggle, IonCardHeader, IonCardContent, IonCard, IonLabel, IonSpinner, IonModal, IonSegmentButton, IonSegment, IonBackdrop, IonImg, IonRow, IonGrid, IonIcon, IonBackButton, IonButtons, IonButton, IonSkeletonText, IonCol, IonText, IonContent, IonHeader, IonToolbar, CommonModule, FormsModule, SectionTitleComponent, InfoChipComponent, MetaItemComponent, CoverImageComponent, CollapsibleComponent, InfoTabComponent, PeopleTabComponent, RelationsTabComponent, StatsTabComponent, RangePipe, IonBadge],
})
export class MediaDetailsPageComponent implements OnDestroy {
  platformService: PlatformService = inject(PlatformService);

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
  showHelloModal: boolean = false;
  private longPressTimer: any;
  private isLongPress: boolean = false;

  // Date picker state
  showStartDatePicker: boolean = false;
  showEndDatePicker: boolean = false;
  startDateISO: string = '';
  endDateISO: string = '';

  // Modal form data
  modalFormData: {
    status?: string;
    score?: number;
    progress?: number;
    progressVolumes?: number | null;
    repeat?: number;
    private?: boolean;
    hiddenFromStatusLists?: boolean;
    notes?: string | null;
    startedAt?: { year?: number | null; month?: number | null; day?: number | null };
    completedAt?: { year?: number | null; month?: number | null; day?: number | null };
  } = {};

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
            const title = `${data.Media.title.romaji}${data.Media.title.english ? ` (${data.Media.title.english})` : ''} · AniMigo`;
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

    // Initialize form data with current entry or defaults
    if (this.data?.mediaListEntry) {
      const entry = this.data.mediaListEntry;
      this.modalFormData = {
        status: entry.status,
        score: entry.score,
        progress: entry.progress,
        progressVolumes: entry.progressVolumes,
        repeat: entry.repeat,
        private: entry.private,
        hiddenFromStatusLists: entry.hiddenFromStatusLists,
        notes: entry.notes,
        startedAt: entry.startedAt ? { ...entry.startedAt } : undefined,
        completedAt: entry.completedAt ? { ...entry.completedAt } : undefined
      };
    } else {
      // Reset for new entry - set default values
      this.modalFormData = {
        status: undefined,
        score: 0,
        progress: 0,
        progressVolumes: 0,
        repeat: 0,
        private: false,
        hiddenFromStatusLists: false,
        notes: '',
        startedAt: undefined,
        completedAt: undefined
      };
    }

    // Collapse the FAB when opening modal
    this.isFabOpen = false;

    // Use setTimeout to ensure modal state is properly reset before opening
    // This prevents issues with rapid open/close cycles
    setTimeout(() => {
      this.showHelloModal = true;
    }, 50);
  }

  closeDetailedMenu() {
    this.showHelloModal = false;
  }

  saveDetailedMenu() {
    if (!this.data?.id) return;

    // Check if any data changed from current to avoid unnecessary API calls
    const entry = this.data.mediaListEntry;
    const hasChanges =
      entry?.status !== this.modalFormData.status ||
      entry?.score !== this.modalFormData.score ||
      entry?.progress !== this.modalFormData.progress ||
      entry?.progressVolumes !== this.modalFormData.progressVolumes ||
      entry?.repeat !== this.modalFormData.repeat ||
      entry?.private !== this.modalFormData.private ||
      entry?.hiddenFromStatusLists !== this.modalFormData.hiddenFromStatusLists ||
      entry?.notes !== this.modalFormData.notes ||
      this.hasDateChanged(entry?.startedAt ?? undefined, this.modalFormData.startedAt) ||
      this.hasDateChanged(entry?.completedAt ?? undefined, this.modalFormData.completedAt);

    if (!hasChanges && entry) {
      this.closeDetailedMenu();
      return;
    }

    // Convert null to undefined for API
    const convertDate = (date?: { year?: number | null; month?: number | null; day?: number | null }) => {
      if (!date) return undefined;
      return {
        year: date.year ?? undefined,
        month: date.month ?? undefined,
        day: date.day ?? undefined
      };
    };

    this.apiService.saveMediaListEntry({
      mediaId: this.data.id,
      status: this.modalFormData.status as any,
      score: this.modalFormData.score,
      progress: this.modalFormData.progress,
      progressVolumes: this.modalFormData.progressVolumes ?? undefined,
      repeat: this.modalFormData.repeat,
      private: this.modalFormData.private,
      hiddenFromStatusLists: this.modalFormData.hiddenFromStatusLists,
      notes: this.modalFormData.notes ?? undefined,
      startedAt: convertDate(this.modalFormData.startedAt),
      completedAt: convertDate(this.modalFormData.completedAt)
    }).subscribe({
      next: (response) => {
        // Update local data to reflect changes immediately - create new reference for change detection
        if (this.data) {
          this.data = {
            ...this.data,
            mediaListEntry: response.data
          };
        }
        this.closeDetailedMenu();
      },
      error: (error) => {
        console.error('Failed to save media list entry:', error);
      }
    });
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

  // Counter methods for modal
  incrementProgress() {
    const current = this.modalFormData.progress || 0;
    const max = this.data?.type === 'ANIME' ? this.data?.episodes : this.data?.chapters;
    if (max && current >= max) return;
    this.modalFormData.progress = current + 1;
  }

  decrementProgress() {
    const current = this.modalFormData.progress || 0;
    if (current <= 0) return;
    this.modalFormData.progress = current - 1;
  }

  incrementVolumes() {
    const current = this.modalFormData.progressVolumes || 0;
    const max = this.data?.volumes;
    if (max && current >= max) return;
    this.modalFormData.progressVolumes = current + 1;
  }

  decrementVolumes() {
    const current = this.modalFormData.progressVolumes || 0;
    if (current <= 0) return;
    this.modalFormData.progressVolumes = current - 1;
  }

  incrementScore() {
    const current = this.modalFormData.score || 0;
    if (current >= 10) return;
    this.modalFormData.score = current + 1;
  }

  decrementScore() {
    const current = this.modalFormData.score || 0;
    if (current <= 0) return;
    this.modalFormData.score = current - 1;
  }

  incrementRepeat() {
    const current = this.modalFormData.repeat || 0;
    this.modalFormData.repeat = current + 1;
  }

  decrementRepeat() {
    const current = this.modalFormData.repeat || 0;
    if (current <= 0) return;
    this.modalFormData.repeat = current - 1;
  }

  setModalStatus(status: 'CURRENT' | 'PLANNING' | 'COMPLETED' | 'DROPPED' | 'PAUSED' | 'REPEATING') {
    this.modalFormData.status = status;
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

  // Date picker methods
  openStartDatePicker() {
    // Convert fuzzy date to ISO string for ion-datetime
    const date = this.modalFormData.startedAt;
    if (date?.year && date?.month && date?.day) {
      this.startDateISO = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
    } else {
      this.startDateISO = new Date().toISOString();
    }
    this.showStartDatePicker = true;
  }

  openEndDatePicker() {
    // Convert fuzzy date to ISO string for ion-datetime
    const date = this.modalFormData.completedAt;
    if (date?.year && date?.month && date?.day) {
      this.endDateISO = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
    } else {
      this.endDateISO = new Date().toISOString();
    }
    this.showEndDatePicker = true;
  }

  onStartDateChange(event: any) {
    const isoDate = event.detail.value;
    if (isoDate) {
      const date = new Date(isoDate);
      this.modalFormData.startedAt = {
        year: date.getFullYear(),
        month: date.getMonth() + 1, // JavaScript months are 0-indexed
        day: date.getDate()
      };
    }
  }

  onEndDateChange(event: any) {
    const isoDate = event.detail.value;
    if (isoDate) {
      const date = new Date(isoDate);
      this.modalFormData.completedAt = {
        year: date.getFullYear(),
        month: date.getMonth() + 1, // JavaScript months are 0-indexed
        day: date.getDate()
      };
    }
  }

  clearStartDate() {
    this.modalFormData.startedAt = undefined;
    this.startDateISO = '';
    this.showStartDatePicker = false;
  }

  clearEndDate() {
    this.modalFormData.completedAt = undefined;
    this.endDateISO = '';
    this.showEndDatePicker = false;
  }

  getStartDateLabel(): string {
    const date = this.modalFormData.startedAt;
    if (date?.year && date?.month && date?.day) {
      return `${date.month}/${date.day}/${date.year}`;
    }
    return 'Start date';
  }

  getEndDateLabel(): string {
    const date = this.modalFormData.completedAt;
    if (date?.year && date?.month && date?.day) {
      return `${date.month}/${date.day}/${date.year}`;
    }
    return 'End date';
  }

  hasDateChanged(
    date1?: { year?: number | null; month?: number | null; day?: number | null },
    date2?: { year?: number | null; month?: number | null; day?: number | null }
  ): boolean {
    // If both are undefined/null, no change
    if (!date1 && !date2) return false;
    // If one exists and the other doesn't, there's a change
    if (!date1 || !date2) return true;
    // Compare individual components
    return date1.year !== date2.year ||
           date1.month !== date2.month ||
           date1.day !== date2.day;
  }
}
