import { Component, Input } from '@angular/core';
import { LoadingStateComponent } from '@components/core/loading-state/loading-state.component';

import { IonChip, IonCol, IonGrid, IonIcon, IonImg, IonNote, IonRow, IonSkeletonText, IonText, IonTitle } from "@ionic/angular/standalone";

@Component({
  selector: 'am-info-chip',
  templateUrl: './info-chip.component.html',
  styleUrls: ['./info-chip.component.scss'],
  imports: [IonIcon, IonSkeletonText, IonImg, IonCol, IonRow, IonText, IonNote, IonChip, IonTitle, IonGrid]
})
export class InfoChipComponent extends LoadingStateComponent {
  @Input() img: string | null | undefined = '';
  @Input() icon: string | null | undefined = '';
  @Input() iconColor: string | null | undefined = '';
  @Input() info: string | number | undefined = '';
  @Input() note: string | null |undefined = null;
  @Input() type: string | null = null;
  @Input() outline: any;
  @Input() clickable: any;
  @Input() vertical: any;
  @Input() horizontal: any;
  @Input() color: any;
  @Input() textColor: any;

  constructor() {
    super();
  }
}
