import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { BadgeAdultComponent } from '@components/atoms/badge-adult/badge-adult.component';
import { LoadingStateComponent } from '@components/core/loading-state/loading-state.component';
import { ApiService } from '@components/core/services/api.service';
import { AuthService } from '@components/core/services/auth.service';
import { PlatformService } from '@components/core/services/platform.service';
import { MediaInfo, MediaListEntry, MediaListModalComponent } from '@components/molecules/media-list-modal/media-list-modal.component';
import { IonButton, IonCol, IonGrid, IonIcon, IonImg, IonNote, IonRippleEffect, IonRow, IonSkeletonText, IonText } from "@ionic/angular/standalone";
import { take } from 'rxjs';

@Component({
  selector: 'am-catalog-item',
  templateUrl: './catalog-item.component.html',
  styleUrls: ['./catalog-item.component.scss'],
  imports: [BadgeAdultComponent, IonNote, IonSkeletonText, IonIcon, IonRow, IonImg, IonText, IonCol, IonGrid, IonRippleEffect, IonButton, MediaListModalComponent],
})
export class CatalogItemComponent extends LoadingStateComponent {
  @Input() image: string | null | undefined = null;
  @Input() fallbackImage: string | null | undefined = null;
  @Input() title: string | null | undefined = null;
  @Input() note: string | null | undefined = null;
  @Input() rating: number | null | undefined = null;
  @Input() recommendation: any = null;
  @Input() isFavourite: boolean | null | undefined = false;
  @Input() mediaStatus: string | null | undefined = null;
  @Input() isAdult: boolean | null | undefined = false;

  // New inputs for FAB functionality
  @Input() mediaId?: number;
  @Input() mediaType?: 'ANIME' | 'MANGA';
  @Input() episodes?: number | null;
  @Input() chapters?: number | null;
  @Input() volumes?: number | null;
  @Input() mediaListEntry?: MediaListEntry;

  @Output() mediaListUpdated = new EventEmitter<MediaListEntry | undefined>();

  imageLoaded: boolean = false;
  isHovered: boolean = false;
  isFabOpen: boolean = false;
  showListUpdateModal: boolean = false;
  private longPressTimer: any;
  private isLongPress: boolean = false;

  platformService: PlatformService = inject(PlatformService);
  authService: AuthService = inject(AuthService);
  private apiService: ApiService = inject(ApiService);

  constructor() {
    super();
  }

  onImageLoad() {
    this.imageLoaded = true;
  }

  onImageError() {
    if (this.image !== this.fallbackImage) {
      this.image = this.fallbackImage;
      this.imageLoaded = false;
    }
  }

  getStatusIcon(status: string): string {
    const statusMap: { [key: string]: string } = {
      'CURRENT': 'play-circle-outline',
      'COMPLETED': 'checkmark-circle-outline',
      'PAUSED': 'pause-circle-outline',
      'DROPPED': 'close-circle-outline',
      'PLANNING': 'bookmark-outline',
      'REPEATING': 'repeat-outline'
    };
    return statusMap[status] || 'bookmark-outline';
  }

  onMouseEnter() {
    if (!this.authService.isAuthenticated() || !this.mediaId) return;
    // Don't show FAB on hover for touch devices
    if (this.platformService.isTouchDevice()) return;
    this.isHovered = true;
  }

  onMouseLeave() {
    this.isHovered = false;
    this.isFabOpen = false;
  }

  onFabClick(event: Event) {
    event.stopPropagation();
    this.openDetailedMenu();
  }

  onToggleClick(event: Event) {
    event.stopPropagation();
    this.isFabOpen = !this.isFabOpen;
  }

  onItemTouchStart(event: Event) {
    // Only handle long press on touch devices
    if (!this.platformService.isTouchDevice()) return;
    if (!this.authService.isAuthenticated() || !this.mediaId) return;

    // Start long press timer (500ms)
    this.isLongPress = false;
    this.longPressTimer = setTimeout(() => {
      this.isLongPress = true;
      // Open media list modal on long press
      this.openDetailedMenu();
    }, 500);
  }

  onItemTouchEnd(event: Event) {
    // Only handle on touch devices
    if (!this.platformService.isTouchDevice()) return;

    // Clear the long press timer
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    // If it was a long press, prevent default click behavior
    if (this.isLongPress) {
      event.preventDefault();
      event.stopPropagation();
      this.isLongPress = false;
    }
  }

  onItemTouchMove(event: Event) {
    // Cancel long press if user moves finger (likely scrolling)
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
      this.isLongPress = false;
    }
  }

  onQuickAction(event: Event, action: 'planning' | 'completed' | 'watching') {
    event.stopPropagation();

    if (!this.mediaId) return;

    const statusMap = {
      'planning': 'PLANNING',
      'completed': 'COMPLETED',
      'watching': 'CURRENT'
    } as const;

    const newStatus = statusMap[action];

    if (this.mediaListEntry?.status === newStatus) {
      this.isFabOpen = false;
      return;
    }

    this.apiService.saveMediaListEntry({
      mediaId: this.mediaId,
      status: newStatus as 'PLANNING' | 'COMPLETED' | 'CURRENT'
    }).pipe(take(1)).subscribe({
      next: (result) => {
        if (result.data) {
          this.mediaListEntry = result.data;
          this.mediaStatus = result.data.status;
          this.mediaListUpdated.emit(result.data);
        }
        this.isFabOpen = false;
      },
      error: (error) => {
        console.error('Failed to save quick action:', error);
      }
    });
  }

  openDetailedMenu() {
    this.isFabOpen = false;
    this.showListUpdateModal = true;
  }

  closeDetailedMenu() {
    this.showListUpdateModal = false;
  }

  onEntrySaved(entry: MediaListEntry | undefined) {
    if (entry) {
      this.mediaListEntry = entry;
      this.mediaStatus = entry.status;
    } else {
      this.mediaListEntry = undefined;
      this.mediaStatus = undefined;
    }
    this.mediaListUpdated.emit(entry);
  }

  getMediaInfo(): MediaInfo | undefined {
    if (!this.mediaId || !this.mediaType) return undefined;

    return {
      id: this.mediaId,
      type: this.mediaType,
      episodes: this.episodes,
      chapters: this.chapters,
      volumes: this.volumes
    };
  }

  getMainButtonIcon(): string {
    return this.mediaListEntry?.id ? 'pencil' : 'add';
  }

  getChevronIcon(): string {
    return this.isFabOpen ? 'chevron-down' : 'chevron-up';
  }
}
