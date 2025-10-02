import { Component, Input } from '@angular/core';
import { LoadingStateComponent } from '@components/core/loading-state/loading-state.component';
import { IonText, IonSkeletonText, IonTitle, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-section-title',
  templateUrl: './section-title.component.html',
  styleUrls: ['./section-title.component.scss'],
  standalone: true,
  imports: [IonTitle, IonSkeletonText],
})
export class SectionTitleComponent extends LoadingStateComponent{
  @Input() title: string = '';
}
