import { Component, Input, OnInit } from '@angular/core';
import { DetailedMedia } from 'src/app/models/aniList/responseInterfaces';
import { IonGrid, IonRow, IonCol, IonTitle } from "@ionic/angular/standalone";
import { CollapsibleComponent } from "@components/molecules/collapsible/collapsible.component";
import { SectionTitleComponent } from "@components/atoms/section-title/section-title.component";
import { CatalogItemComponent } from "@components/atoms/catalog-item/catalog-item.component";
import { RangePipe } from "../../../helpers/range.pipe";
import { toSentenceCase } from 'src/app/helpers/utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-relations-tab',
  templateUrl: './relations-tab.component.html',
  styleUrls: ['./relations-tab.component.scss'],
  imports: [IonCol, IonRow, IonGrid, CollapsibleComponent, SectionTitleComponent, CatalogItemComponent, RangePipe, IonTitle, RangePipe],
})
export class RelationsTabComponent  implements OnInit {
  @Input() data: DetailedMedia | null | undefined = undefined;
  @Input() loading: boolean = true;

  toSentenceCase = toSentenceCase;

  constructor(private router: Router) { }

  ngOnInit() {}

  goToDetails(id: number, type: 'ANIME' | 'MANGA') {
    this.router.navigate(['media', type.toLowerCase(), id])
  }
}
