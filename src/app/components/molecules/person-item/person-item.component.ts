import { Component, Input } from '@angular/core';
import { CollapsibleComponent } from "@components/molecules/collapsible/collapsible.component";
import { IonCol, IonGrid, IonImg, IonLabel, IonNote, IonRow, IonSkeletonText } from "@ionic/angular/standalone";
import { toSentenceCase } from 'src/app/helpers/utils';

@Component({
  selector: 'app-person-item',
  templateUrl: './person-item.component.html',
  styleUrls: ['./person-item.component.scss'],
  imports: [IonNote, IonLabel, IonRow, IonImg, IonGrid, IonCol, CollapsibleComponent, IonSkeletonText],
})
export class PersonItemComponent {
  @Input() loading: boolean = false;
  @Input() image: string | null | undefined = "";
  @Input() fallbackImage: string | null | undefined = "";
  @Input() name: string = "";
  @Input() note: string = "";

  toSentenceCase = toSentenceCase;

  constructor() { }

  onImageError() {
    if (this.image !== this.fallbackImage) {
      this.image = this.fallbackImage;
    }
  }
}
