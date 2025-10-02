import { Component, Input, OnInit } from '@angular/core';
import { IonImg, IonText, IonItem, IonCard, IonLabel, IonRow, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { star } from 'ionicons/icons';

@Component({
  selector: 'app-catalog-item',
  templateUrl: './catalog-item.component.html',
  styleUrls: ['./catalog-item.component.scss'],
  imports: [IonIcon, IonRow, IonLabel, IonImg, IonText, IonCard],
})
export class CatalogItemComponent  implements OnInit {
  @Input() image: string = '';
  @Input() title: string = '';
  @Input() rating: number | undefined;

  constructor() { }

  ngOnInit() {
    addIcons({star});
  }
}
