import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { toSentenceCase } from 'src/app/helpers/utils';

@Component({
  selector: 'am-media-list-item',
  templateUrl: './media-list-item.component.html',
  styleUrls: ['./media-list-item.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class MediaListItemComponent  implements OnInit {
  @Input() media: any;
  @Input() tag: string | undefined;
  @Input() isFavourite: boolean | null | undefined = false;
  @Input() role: string | undefined;

  coverImg: string = '';

  toSentenceCase = toSentenceCase;

  constructor() { }

  ngOnInit() {
    this.coverImg = this.media.coverImage.large?.replace('medium', 'large') ?? this.media.coverImage.medium;
  }

  onImageError() {
    this.coverImg = this.media.coverImage.large;
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
