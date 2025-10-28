import { Component, Input, OnInit } from '@angular/core';
import { SectionTitleComponent } from "@components/atoms/section-title/section-title.component";
import { IonItem } from "@ionic/angular/standalone";

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
  }

}
