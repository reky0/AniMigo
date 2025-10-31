import { Component, Input, OnInit } from '@angular/core';
import { DetailedMedia } from 'src/app/models/aniList/responseInterfaces';
import { IonGrid, IonRow, IonCol, IonTitle } from "@ionic/angular/standalone";
import { CollapsibleComponent } from "@components/molecules/collapsible/collapsible.component";
import { SectionTitleComponent } from "@components/atoms/section-title/section-title.component";
import { CatalogItemComponent } from "@components/atoms/catalog-item/catalog-item.component";
import { RangePipe } from "../../../helpers/range.pipe";
import { toSentenceCase } from 'src/app/helpers/utils';
import { Router } from '@angular/router';
import { AuthService } from '@components/core/services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-relations-tab',
  templateUrl: './relations-tab.component.html',
  styleUrls: ['./relations-tab.component.scss'],
  imports: [IonCol, IonRow, IonGrid, CollapsibleComponent, SectionTitleComponent, CatalogItemComponent, RangePipe, IonTitle, RangePipe],
})
export class RelationsTabComponent implements OnInit {
  @Input() data: DetailedMedia | null | undefined = undefined;
  @Input() loading: boolean = true;

  toSentenceCase = toSentenceCase;

  constructor(
    private router: Router,
    private readonly authService: AuthService,
    private readonly toastController: ToastController
  ) { }

  ngOnInit() { }

  goToDetails(id: number, type: 'ANIME' | 'MANGA', isAdult: boolean | null | undefined) {
    if (isAdult && !this.authService.getUserData()?.options?.displayAdultContent) {
      this.showErrorToast("Oops, your settings don't allow me to show you that! (Adult content warning)")
    } else {
      this.router.navigate(['media', type.toLowerCase(), id])
    }
  }

  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      animated: true,
      icon: 'alert-circle',
      color: 'danger',
      position: 'bottom',
      cssClass: 'multiline-toast', // Add custom class
      swipeGesture: 'vertical'
    });
    console.log(message);

    await toast.present();
  }
}
