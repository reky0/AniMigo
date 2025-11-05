import { Component, Input } from '@angular/core';
import { LoadingStateComponent } from '@components/core/loading-state/loading-state.component';
import { IonCardTitle, IonSkeletonText } from "@ionic/angular/standalone";

@Component({
  selector: 'am-section-title',
  templateUrl: './section-title.component.html',
  styleUrls: ['./section-title.component.scss'],
  standalone: true,
  imports: [IonCardTitle, IonSkeletonText],
})
export class SectionTitleComponent extends LoadingStateComponent{
  @Input() title: string | undefined = '';
}
