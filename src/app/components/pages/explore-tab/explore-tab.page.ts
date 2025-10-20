import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InfoChipComponent } from "@components/atoms/info-chip/info-chip.component";
import { ApiService } from '@components/core/services/api-service';
import { PlatformService } from '@components/core/services/platform-service';
import { IonCol, IonContent, IonGrid, IonHeader, IonRow, IonSearchbar, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explore-tab',
  templateUrl: './explore-tab.page.html',
  styleUrls: ['./explore-tab.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonGrid, IonSearchbar, IonRow, IonCol, InfoChipComponent]
})
export class ExploreTabPage implements OnInit {

  constructor(readonly platformService: PlatformService, private readonly router: Router) { }

  ngOnInit() {
  }

  navigate(target: string) {
    console.log('Navigate to:', target);

    switch(target) {
      case 'calendar':
        this.router.navigate(['calendar']);
        break;
    }
  }
}
