import { Component, EnvironmentInjector, inject, OnInit } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { PlatformService } from '../components/core/services/platform.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage implements OnInit {
  public environmentInjector = inject(EnvironmentInjector);
  platformService: PlatformService = inject(PlatformService);
  tabsPlacement: string = 'bottom';

  constructor() {
  }

  ngOnInit() {
    this.tabsPlacement = this.platformService.isHybrid() ? 'bottom' : 'top';
  }
}
