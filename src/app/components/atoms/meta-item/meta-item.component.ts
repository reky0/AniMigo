import { Component, Input } from '@angular/core';
import { LoadingStateComponent } from '@components/core/loading-state/loading-state.component';
import { IonIcon, IonItem, IonSkeletonText, IonText } from "@ionic/angular/standalone";

@Component({
  selector: 'app-meta-item',
  templateUrl: './meta-item.component.html',
  styleUrls: ['./meta-item.component.scss'],
  imports: [IonSkeletonText, IonItem, IonIcon, IonText],
})
export class MetaItemComponent extends LoadingStateComponent {
  @Input() icon: string = "";
  @Input() text: string | null | undefined = "";
  @Input() nolines: any;

  constructor() {
    super()
  }
}
