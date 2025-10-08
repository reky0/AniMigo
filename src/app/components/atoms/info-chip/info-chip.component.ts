import { Component, Input, OnInit } from '@angular/core';

import { IonChip, IonTitle, IonNote, IonText, IonLabel, IonCard, IonCardTitle, IonGrid, IonRow, IonCol, IonImg } from "@ionic/angular/standalone";

@Component({
  selector: 'app-info-chip',
  templateUrl: './info-chip.component.html',
  styleUrls: ['./info-chip.component.scss'],
  imports: [IonImg, IonCol, IonRow, IonText, IonNote, IonChip, IonTitle, IonGrid]
})
export class InfoChipComponent  implements OnInit {
  @Input() icon: string | null | undefined = '';
  @Input() info: string | number = '';
  @Input() note: string | null |undefined = null;
  @Input() type: string | null = null;
  @Input() border: boolean = false;
  @Input() clickable: boolean = false;
  @Input() direction: string = 'column'

  cursor: string = '';
  pointerEvents: string = '';

  constructor() { }

  ngOnInit() {
    this.cursor = this.clickable ? 'pointer' : 'default';
    this.pointerEvents = this.clickable ? 'auto' : 'none';

  }

}
