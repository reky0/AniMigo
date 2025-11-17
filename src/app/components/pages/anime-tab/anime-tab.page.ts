import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlatformService } from '@components/core/services/platform.service';
import { ToastService } from '@components/core/services/toast.service';
import { UserMediaCollectionComponent } from '@components/organisms/user-media-collection/user-media-collection.component';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

@Component({
  selector: 'am-anime-tab',
  templateUrl: './anime-tab.page.html',
  styleUrls: ['./anime-tab.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    UserMediaCollectionComponent
  ]
})
export class AnimeTabPage implements OnInit {

  constructor(
    private readonly toastService: ToastService,
    public readonly platformService: PlatformService
  ) { }

  ngOnInit() {
    this.toastService.setTabBarVisibility(this.platformService.isHybrid());
  }
}
