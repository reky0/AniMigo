import { Component, Input, OnInit } from '@angular/core';
import { BadgeAdultComponent } from '@components/atoms/badge-adult/badge-adult.component';
import { LoadingStateComponent } from '@components/core/loading-state/loading-state.component';
import { IonCardTitle, IonCol, IonIcon, IonImg, IonNote, IonRippleEffect, IonRow, IonSkeletonText } from '@ionic/angular/standalone';
import { toSentenceCase } from 'src/app/helpers/utils';

@Component({
  selector: 'am-media-list-item',
  templateUrl: './media-list-item.component.html',
  styleUrls: ['./media-list-item.component.scss'],
  standalone: true,
  imports: [BadgeAdultComponent, IonSkeletonText, IonCardTitle, IonCol, IonIcon, IonImg, IonNote, IonRippleEffect, IonRow]
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

  constructor() {
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
}
