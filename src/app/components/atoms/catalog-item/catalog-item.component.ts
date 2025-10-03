import { Component, Input, OnInit } from '@angular/core';
import { LoadingStateComponent } from '@components/core/loading-state/loading-state.component';
import { IonImg, IonText, IonRow, IonIcon, IonSkeletonText, IonCol, IonGrid } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { star } from 'ionicons/icons';

@Component({
  selector: 'app-catalog-item',
  templateUrl: './catalog-item.component.html',
  styleUrls: ['./catalog-item.component.scss'],
  imports: [IonSkeletonText, IonIcon, IonRow, IonImg, IonText, IonCol, IonGrid],
})
export class CatalogItemComponent extends LoadingStateComponent implements OnInit {
  @Input() image: string | null | undefined = '';
  @Input() title: string | null | undefined = '';
  @Input() rating: number | null | undefined = undefined;

  constructor() {
    super();
  }

  ngOnInit() {
    addIcons({star});
  }
}
