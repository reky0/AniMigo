import { Component, Input } from '@angular/core';
import { LoadingStateComponent } from '@components/core/loading-state/loading-state.component';
import { IonImg, IonSkeletonText } from "@ionic/angular/standalone";

@Component({
  selector: 'app-cover-image',
  templateUrl: './cover-image.component.html',
  styleUrls: ['./cover-image.component.scss'],
  imports: [IonSkeletonText, IonImg],
})
export class CoverImageComponent extends LoadingStateComponent {
  @Input() float: boolean = false;
  @Input() src: string | null | undefined;
  @Input() fallbackSrc: string | null | undefined; // Default fallback image

  constructor() {
    super()
  }

  onImageError() {
    // Set the fallback image when the original fails to load
    if (this.src !== this.fallbackSrc) {
      this.src = this.fallbackSrc;
    }
  }

}
