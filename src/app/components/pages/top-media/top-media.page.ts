import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonBackButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInfiniteScroll, IonInfiniteScrollContent, IonRow, IonSkeletonText, IonToolbar, IonTitle } from '@ionic/angular/standalone';
import { GET_TOP_MEDIA } from 'src/app/models/aniList/mediaQueries';
import { take } from 'rxjs';
import { ApiService } from '@components/core/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthService } from '@components/core/services/auth.service';
import { ToastController } from '@ionic/angular';
import { toSentenceCase } from 'src/app/helpers/utils';
import { MediaListItemComponent } from "@components/molecules/media-list-item/media-list-item.component";
import { RangePipe } from "../../../helpers/range.pipe";
import { TopMediaConfig } from 'src/app/models/top-media-config.interface';

@Component({
  selector: 'app-top-media',
  templateUrl: './top-media.page.html',
  styleUrls: ['./top-media.page.scss'],
  standalone: true,
  imports: [
    IonTitle, IonRow, IonContent, IonHeader, IonToolbar,
    CommonModule, FormsModule, IonGrid, IonCol,
    MediaListItemComponent, IonInfiniteScroll,
    IonInfiniteScrollContent, IonButtons, IonBackButton,
    RangePipe, IonSkeletonText
  ],
})
export class TopMediaPage implements OnInit {

  toSentenceCase = toSentenceCase;

  mediaEdges: Array<any> = [];
  private mediaIdSet = new Set<number>();

  type: string | null = null;
  page: number = 1;
  perPage: number = 25;
  hasNextPage = true;
  loadingMore = false;

  loading: boolean = true;
  error: any;

  config!: TopMediaConfig;
  pageTitle: string = '';
  defaultHref: string = '/explore';

  constructor(
    private readonly apiService: ApiService,
    private readonly route: ActivatedRoute,
    private readonly titleService: Title,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly toastController: ToastController
  ) { }

  ngOnInit() {
    // Get configuration from route data
    this.config = this.route.snapshot.data['config'] as TopMediaConfig;

    // Determine type based on configuration
    if (this.config.typeSource === 'fixed') {
      this.type = this.config.fixedType || 'anime';
    } else {
      this.type = this.route.snapshot.paramMap.get("type");
    }

    // Set page title
    const typeDisplay = this.type ? this.toSentenceCase(this.type) : '';
    this.pageTitle = this.config.typeSource === 'fixed'
      ? this.config.titlePrefix
      : `${this.config.titlePrefix} ${typeDisplay}`;

    this.titleService.setTitle(`${this.pageTitle} · AniMigo`);
    this.defaultHref = this.config.defaultHref;

    this.loadMore();
  }

  ionViewWillEnter() {
    const typeDisplay = this.type ? this.toSentenceCase(this.type) : '';
    this.pageTitle = this.config.typeSource === 'fixed'
      ? this.config.titlePrefix
      : `${this.config.titlePrefix} ${typeDisplay}`;

    this.titleService.setTitle(`${this.pageTitle} · AniMigo`);
    this.defaultHref = this.config.defaultHref;
  }

  goToDetails(id: number, isAdult: boolean | null | undefined) {
    if (isAdult && !this.authService.getUserData()?.options?.displayAdultContent) {
      this.showErrorToast("Oops, your settings don't allow me to show you that! (Adult content warning)");
      return;
    }

    setTimeout(() => {
      this.router.navigate(['media', this.type, id]);
    }, 100);
  }

  async loadMore(event?: any) {
    if (this.loadingMore || !this.hasNextPage) {
      event?.target?.complete();
      console.log('end');
      return;
    }

    // Check max items limit before making the request
    if (this.config.maxItems && this.mediaEdges.length >= this.config.maxItems) {
      event?.target?.complete();
      if (event) {
        event.target.disabled = true;
      }
      console.log('end');
      return;
    }

    this.loadingMore = true;

    const variables: any = {
      type: this.type?.toUpperCase(),
      page: this.page,
      sort: this.config.sortType,
      perPage: this.perPage,
      isAdult: false
    };

    // Add format if specified in config
    if (this.config.format) {
      variables.format = this.config.format;
    }

    console.log(variables);

    this.apiService
      .fetchBasicData(GET_TOP_MEDIA, variables)
      .pipe(take(1))
      .subscribe({
        next: ({ data, errors }) => {
          if (!errors) {
            const newEdges = data?.Page?.media ?? [];
            for (const e of newEdges) {
              const id = e?.id;
              if (id && !this.mediaIdSet.has(id)) {
                this.mediaIdSet.add(id);
                this.mediaEdges.push(e);
              }
            }
            console.log(this.mediaEdges);

            const pageInfo = data?.Page?.pageInfo;
            this.page = this.page + 1;
            this.hasNextPage = !!pageInfo?.hasNextPage;
          } else {
            console.log('error');
          }

          this.loadingMore = false;
          if (event) {
            event.target.complete();
            if (!this.hasNextPage) {
              event.target.disabled = true;
            }
            // Check max items after loading
            if (this.config.maxItems && this.mediaEdges.length >= this.config.maxItems) {
              event.target.disabled = true;
            }
          }
        },
        error: () => {
          this.loadingMore = false;
          event?.target?.complete();
          console.log('end');
        }
      });
  }

  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      animated: true,
      icon: 'alert-circle',
      color: 'danger',
      position: 'bottom',
      cssClass: 'multiline-toast',
      swipeGesture: 'vertical'
    });
    console.log(message);

    await toast.present();
  }
}
