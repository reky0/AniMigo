import { Component, Input } from '@angular/core';
import { IonBadge, IonCard, IonIcon, IonItem, IonLabel, IonList } from '@ionic/angular/standalone';

export interface MediaStatusCounts {
  current: number;
  completed: number;
  onHold: number;
  dropped: number;
  planning: number;
  repeating: number;
}

@Component({
  selector: 'am-media-status-stats',
  templateUrl: './media-status-stats.component.html',
  styleUrls: ['./media-status-stats.component.scss'],
  standalone: true,
  imports: [IonCard, IonList, IonItem, IonIcon, IonLabel, IonBadge]
})
export class MediaStatusStatsComponent {
  @Input() title: string = '';
  @Input() mediaType: 'ANIME' | 'MANGA' = 'ANIME';
  @Input() statusCounts: MediaStatusCounts = {
    current: 0,
    completed: 0,
    onHold: 0,
    dropped: 0,
    planning: 0,
    repeating: 0
  };

  get labels() {
    return this.mediaType === 'ANIME' ? {
      current: 'Watching',
      planning: 'Plan to Watch',
      repeating: 'Rewatching'
    } : {
      current: 'Reading',
      planning: 'Plan to Read',
      repeating: 'Rereading'
    };
  }
}
