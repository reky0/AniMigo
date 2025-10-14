import { Component, Input, OnInit } from '@angular/core';
import { IonCol, IonBackdrop, IonImg, IonIcon, IonRow } from "@ionic/angular/standalone";
import { openUrl } from 'src/app/helpers/utils';

@Component({
  selector: 'app-media-thumbnail',
  templateUrl: './media-thumbnail.component.html',
  styleUrls: ['./media-thumbnail.component.scss'],
  imports: [IonRow, IonIcon, IonImg, IonBackdrop, IonCol],
})
export class MediaThumbnailComponent  implements OnInit {
  @Input() size: number = 7;
  @Input() sizeLg: number = 4;
  @Input() thumbnail: string | undefined | null = "";
  @Input() mediaUrl: string | undefined = "";

  openUrl = openUrl;

  constructor() { }

  ngOnInit() {}
}
