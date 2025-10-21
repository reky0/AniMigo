import { Component, Input, OnInit } from '@angular/core';
import { IonRow, IonCol, IonImg } from "@ionic/angular/standalone";
import { IonicModule } from '@ionic/angular';
import { toSentenceCase } from 'src/app/helpers/utils';

@Component({
  selector: 'app-media-list-item',
  templateUrl: './media-list-item.component.html',
  styleUrls: ['./media-list-item.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class MediaListItemComponent  implements OnInit {
  @Input() media: any;

  toSentenceCase = toSentenceCase;

  constructor() { }

  ngOnInit() {}
}
