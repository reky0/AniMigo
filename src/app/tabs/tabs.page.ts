import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square, home, tv, book, personCircle, compass } from 'ionicons/icons';
import { PlatformService } from '../components/core/services/platform-service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);
  platformService: PlatformService = inject(PlatformService);
  tabsPlacement: string = 'bottom';

  constructor() {
    addIcons({ triangle, ellipse, square, home, tv, book, personCircle, compass });
  }

  ngOnInit() {
    this.tabsPlacement = this.platformService.isHybrid() ? 'bottom' : 'top';
  }
}
