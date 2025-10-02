import { Component, Input, OnInit } from '@angular/core';
import { SectionTitleComponent } from "@components/atoms/section-title/section-title.component";
import { IonButton, IonIcon, IonBackButton, IonButtons, IonToast, IonToolbar, IonHeader, IonTitle, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { arrowForward } from 'ionicons/icons';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss'],
  imports: [IonItem, SectionTitleComponent],
})
export class SectionHeaderComponent  implements OnInit {
  @Input() title: string = '';
  @Input() loading: boolean = true;

  constructor() { }

  ngOnInit() {
    addIcons({arrowForward})
  }

}
