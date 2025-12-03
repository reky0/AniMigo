import { Component, Input } from '@angular/core';
import { IonCol, IonGrid, IonImg, IonLabel, IonNote, IonRippleEffect, IonRow, IonSkeletonText } from "@ionic/angular/standalone";
import { toSentenceCase } from 'src/app/helpers/utils';
@Component({
  selector: 'am-person-item',
  templateUrl: './person-item.component.html',
  styleUrls: ['./person-item.component.scss'],
  imports: [IonNote, IonLabel, IonRow, IonImg, IonGrid, IonCol, IonSkeletonText, IonRippleEffect],
})
export class PersonItemComponent {
  @Input() loading: boolean = false;
  @Input() image: string | null | undefined = "";
  @Input() fallbackImage: string | null | undefined = "";
  @Input() name: string = "";
  @Input() note: string = "";
  @Input() isFavourite: boolean | null | undefined = false;

  imageLoaded: boolean = false;

  toSentenceCase = toSentenceCase;

  constructor() { }

  onImageLoad() {
    this.imageLoaded = true;
  }

  onImageError() {
    this.imageLoaded = true;
    if (this.image !== this.fallbackImage) {
      this.image = this.fallbackImage;
    }
  }
}
