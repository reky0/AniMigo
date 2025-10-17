import { Component, Input, OnInit } from '@angular/core';
import { LoadingStateComponent } from '@components/core/loading-state/loading-state.component';
import { IonImg, IonText, IonRow, IonIcon, IonSkeletonText, IonCol, IonGrid, IonNote } from "@ionic/angular/standalone";
import { IonicModule } from "@ionic/angular";

@Component({
  selector: 'app-catalog-item',
  templateUrl: './catalog-item.component.html',
  styleUrls: ['./catalog-item.component.scss'],
  imports: [IonNote, IonSkeletonText, IonIcon, IonRow, IonImg, IonText, IonCol, IonGrid],
})
export class CatalogItemComponent extends LoadingStateComponent implements OnInit {
  @Input() image: string | null | undefined = null;
  @Input() title: string | null | undefined = null;
  @Input() note: string | null | undefined = null;
  @Input() rating: number | null | undefined = null;
  @Input() recommendation: any = null;

  constructor() {
    super();
  }

  ngOnInit() { }
}
