import { Component, Input, OnInit } from '@angular/core';
import { LoadingStateComponent } from '@components/core/loading-state/loading-state.component';
import { IonImg, IonSkeletonText } from "@ionic/angular/standalone";

@Component({
  selector: 'app-cover-image',
  templateUrl: './cover-image.component.html',
  styleUrls: ['./cover-image.component.scss'],
  imports: [IonSkeletonText, IonImg],
})
export class CoverImageComponent extends LoadingStateComponent implements OnInit {
  @Input() float: boolean = false;
  @Input() src: string | null | undefined = "";


  constructor() {
    super()
  }

  ngOnInit() {}

}
