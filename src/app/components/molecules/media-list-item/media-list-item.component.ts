import { Component, Input, OnInit } from '@angular/core';
import { BadgeAdultComponent } from '@components/atoms/badge-adult/badge-adult.component';
import { LoadingStateComponent } from '@components/core/loading-state/loading-state.component';
import { AuthService } from '@components/core/services/auth.service';
import { IonCardTitle, IonCol, IonIcon, IonImg, IonNote, IonProgressBar, IonRippleEffect, IonRow, IonSkeletonText } from '@ionic/angular/standalone';
import { getPreferredTitle, toSentenceCase } from 'src/app/helpers/utils';

@Component({
  selector: 'am-media-list-item',
  templateUrl: './media-list-item.component.html',
  styleUrls: ['./media-list-item.component.scss'],
  standalone: true,
  imports: [BadgeAdultComponent, IonSkeletonText, IonCardTitle, IonCol, IonIcon, IonImg, IonNote, IonProgressBar, IonRippleEffect, IonRow]
})
export class MediaListItemComponent extends LoadingStateComponent implements OnInit {
  @Input() media: any;
  @Input() tag: string | undefined;
  @Input() isFavourite: boolean | null | undefined = false;
  @Input() role: string | undefined;
  @Input() isAdult: boolean | null | undefined = false;

  coverImg: string = '';
  imageLoaded: boolean = false;

  toSentenceCase = toSentenceCase;
  getPreferredTitle = getPreferredTitle;

  constructor(public authService: AuthService) {
    super();
  }

  ngOnInit() {
    if (!this.loading && this.media) {
      this.coverImg = this.media.coverImage.large?.replace('medium', 'large') ?? this.media.coverImage.medium;
    }
  }

  onImageLoad() {
    this.imageLoaded = true;
  }

  onImageError() {
    if (this.media) {
      this.coverImg = this.media.coverImage.large;
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

  getProgress(): number {
    if (!this.media?.mediaListEntry) return 0;
    return this.media.mediaListEntry.progress || 0;
  }

  getTotalProgress(): number | null {
    if (!this.media) return null;

    // For anime, use episodes
    if (this.media.type === 'ANIME') {
      return this.media.episodes || null;
    }

    // For manga, use chapters
    if (this.media.type === 'MANGA') {
      return this.media.chapters || null;
    }

    return null;
  }

  getProgressText(): string {
    const current = this.getProgress();
    const total = this.getTotalProgress();

    if (total === null) {
      // Unknown total, just show current progress
      return `${current}`;
    }

    // Known total, show N/N format
    return `${current}/${total}`;
  }

  getProgressPercentage(): number {
    if (!this.media?.mediaListEntry) return 0;

    const current = this.getProgress();
    const total = this.getTotalProgress();

    if (total === null || total === 0) return 0;

    return current / total;
  }

  hasProgress(): boolean {
    return !!this.media?.mediaListEntry;
  }
}
