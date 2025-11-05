import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '@components/core/services/toast.service';
import { PlatformService } from '@components/core/services/platform.service';
import { IonContent, IonHeader, IonText, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'am-anime-tab',
  templateUrl: './anime-tab.page.html',
  styleUrls: ['./anime-tab.page.scss'],
  standalone: true,
  imports: [IonText, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AnimeTabPage implements OnInit {

  constructor(
    private readonly toastService: ToastService,
    private readonly platformService: PlatformService
  ) { }

  ngOnInit() {
    this.toastService.setTabBarVisibility(this.platformService.isHybrid());
  }
}
