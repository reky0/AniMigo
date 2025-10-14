import { Component, Input, OnInit } from '@angular/core';
import { LoadingStateComponent } from '@components/core/loading-state/loading-state.component';

import { IonChip, IonCol, IonGrid, IonImg, IonNote, IonRow, IonSkeletonText, IonText, IonTitle } from "@ionic/angular/standalone";

@Component({
  selector: 'app-info-chip',
  templateUrl: './info-chip.component.html',
  styleUrls: ['./info-chip.component.scss'],
  imports: [IonSkeletonText, IonImg, IonCol, IonRow, IonText, IonNote, IonChip, IonTitle, IonGrid]
})
export class InfoChipComponent extends LoadingStateComponent implements OnInit {
  @Input() icon: string | null | undefined = '';
  @Input() info: string | number = '';
  @Input() note: string | null |undefined = null;
  @Input() type: string | null = null;
  @Input() outline: any;
  @Input() clickable: any;
  @Input() vertical: any;
  @Input() horizontal: any;

  constructor() {
    super();
  }

  ngOnInit() {
  }
}
