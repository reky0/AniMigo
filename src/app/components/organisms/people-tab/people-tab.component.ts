import { Component, Input, OnInit } from '@angular/core';
import { DetailedMedia } from 'src/app/models/aniList/responseInterfaces';
import { IonGrid, IonRow, IonCol, IonTitle, IonRouterOutlet, IonText, IonModal, IonSkeletonText } from "@ionic/angular/standalone";
import { SectionTitleComponent } from "@components/atoms/section-title/section-title.component";
import { PersonItemComponent } from "@components/molecule/person-item/person-item.component";
import { CollapsibleComponent } from "@components/molecules/collapsible/collapsible.component";
import { CharacterItemComponent } from "@components/molecule/character-item/character-item.component";
import { RangePipe } from 'src/app/helpers/range.pipe';

@Component({
  selector: 'app-people-tab',
  templateUrl: './people-tab.component.html',
  styleUrls: ['./people-tab.component.scss'],
  imports: [RangePipe, IonRow, IonGrid, IonCol, SectionTitleComponent, PersonItemComponent, CollapsibleComponent, CharacterItemComponent],
})
export class PeopleTabComponent  implements OnInit {
  @Input() data: DetailedMedia | null | undefined = undefined;
  @Input() loading: boolean = true;

  constructor() { }

  ngOnInit() {}

}
