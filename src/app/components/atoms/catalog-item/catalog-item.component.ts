import { Component, Input } from '@angular/core';
import { LoadingStateComponent } from '@components/core/loading-state/loading-state.component';
import { IonCol, IonGrid, IonIcon, IonImg, IonNote, IonRow, IonSkeletonText, IonText } from "@ionic/angular/standalone";

@Component({
  selector: 'am-catalog-item',
  templateUrl: './catalog-item.component.html',
  styleUrls: ['./catalog-item.component.scss'],
  imports: [IonNote, IonSkeletonText, IonIcon, IonRow, IonImg, IonText, IonCol, IonGrid],
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

  constructor() {
    super();
  }

  onImageError() {
    if (this.image !== this.fallbackImage) {
      this.image = this.fallbackImage;
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
