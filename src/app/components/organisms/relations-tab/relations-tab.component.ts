import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CatalogItemComponent } from "@components/atoms/catalog-item/catalog-item.component";
import { SectionTitleComponent } from "@components/atoms/section-title/section-title.component";
import { AuthService } from '@components/core/services/auth.service';
import { ToastService } from '@components/core/services/toast.service';
import { CollapsibleComponent } from "@components/molecules/collapsible/collapsible.component";
import { IonCol, IonGrid, IonRow, IonTitle } from "@ionic/angular/standalone";
import { getPreferredTitle, toSentenceCase } from 'src/app/helpers/utils';
import { DetailedMedia } from 'src/app/models/aniList/responseInterfaces';
import { RangePipe } from "../../../helpers/range.pipe";

@Component({
  selector: 'am-relations-tab',
  templateUrl: './relations-tab.component.html',
  styleUrls: ['./relations-tab.component.scss'],
  imports: [IonCol, IonRow, IonGrid, CollapsibleComponent, SectionTitleComponent, CatalogItemComponent, RangePipe, IonTitle, RangePipe],
})
export class RelationsTabComponent implements OnInit {
  @Input() data: DetailedMedia | null | undefined = undefined;
  @Input() loading: boolean = true;

  toSentenceCase = toSentenceCase;
  getPreferredTitle = getPreferredTitle;

  constructor(
    private router: Router,
    public readonly authService: AuthService,
    private readonly toastService: ToastService
  ) { }

  ngOnInit() {
    this.toastService.setTabBarVisibility(false);
  }

  goToDetails(id: number, type: 'ANIME' | 'MANGA', isAdult: boolean | null | undefined) {
    if (isAdult && !this.authService.getUserData()?.options?.displayAdultContent) {
      this.showErrorToast("Oops, your settings don't allow me to show you that! (Adult content warning)")
    } else {
      this.router.navigate(['media', type.toLowerCase(), id])
    }
  }

  private async showErrorToast(message: string) {
    // Use ToastService with alerts for reliable notifications
    await this.toastService.error(message);
  }
}
