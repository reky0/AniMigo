import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '@components/core/services/toast.service';
import { PlatformService } from '@components/core/services/platform.service';
import { IonContent, IonHeader, IonText, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'am-manga-tab',
  templateUrl: './manga-tab.page.html',
  styleUrls: ['./manga-tab.page.scss'],
  standalone: true,
  imports: [IonText, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MangaTabPage implements OnInit {

  constructor(
    private readonly toastService: ToastService,
    private readonly platformService: PlatformService
  ) { }

  ngOnInit() {
    this.toastService.setTabBarVisibility(this.platformService.isHybrid());
  }
}
