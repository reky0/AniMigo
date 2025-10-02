import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonText, IonItem, IonList } from '@ionic/angular/standalone';
import { PlatformService } from '@components/core/services/platform-service';
import { SectionHeaderComponent } from "@components/molecules/section-header/section-header.component";
import { CatalogItemComponent } from "@components/atoms/catalog-item/catalog-item.component";

@Component({
  selector: 'app-home-tab',
  templateUrl: './home-tab.page.html',
  styleUrls: ['./home-tab.page.scss'],
  standalone: true,
  imports: [IonList, IonContent, IonTitle, IonToolbar, CommonModule, FormsModule, IonHeader, SectionHeaderComponent, CatalogItemComponent]
})
export class HomeTabPage implements OnInit {
  platformService: PlatformService = inject(PlatformService);

  constructor() { }

  ngOnInit() {

  }
}
