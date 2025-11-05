import { Component, EnvironmentInjector, inject, OnInit } from '@angular/core';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { PlatformService } from '../components/core/services/platform.service';

@Component({
  selector: 'am-tabs',
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
