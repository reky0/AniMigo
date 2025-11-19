import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@components/core/services/api.service';
import { AuthService } from '@components/core/services/auth.service';
import { ToastService } from '@components/core/services/toast.service';
import { MediaListItemComponent } from "@components/molecules/media-list-item/media-list-item.component";
import { IonBackButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInfiniteScroll, IonInfiniteScrollContent, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { take } from 'rxjs';
import { toSentenceCase } from 'src/app/helpers/utils';
import { GET_MEDIA_LIST } from 'src/app/models/aniList/mediaQueries';
import { MediaListConfig } from 'src/app/models/media-list-config.interface';
import { RangePipe } from "../../../helpers/range.pipe";

@Component({
  selector: 'am-media-list',
  templateUrl: './media-list.page.html',
  styleUrls: ['./media-list.page.scss'],
  standalone: true,
  imports: [
    IonTitle, IonRow, IonContent, IonHeader, IonToolbar,
    CommonModule, FormsModule, IonGrid, IonCol,
    MediaListItemComponent, IonInfiniteScroll,
    IonInfiniteScrollContent, IonButtons, IonBackButton,
    RangePipe
  ],
})
export class MediaListPage implements OnInit {

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

  config!: MediaListConfig;
  pageTitle: string = '';
  defaultHref: string = '/explore';

  constructor(
    private readonly apiService: ApiService,
    private readonly route: ActivatedRoute,
    private readonly titleService: Title,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly toastService: ToastService
  ) { }

  ngOnInit() {
    this.toastService.setTabBarVisibility(false);

    // Get configuration from route data
    this.config = this.route.snapshot.data['config'] as MediaListConfig;

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
    // Prevent multiple simultaneous requests
    if (this.loadingMore) {
      event?.target?.complete();
      return;
    }

    if (!this.hasNextPage) {
      event?.target?.complete();
      if (event) {
        event.target.disabled = true;
      }
      return;
    }

    // Check max items limit before making the request
    if (this.config.maxItems && this.mediaEdges.length >= this.config.maxItems) {
      event?.target?.complete();
      if (event) {
        event.target.disabled = true;
      }
      return;
    }

    this.loadingMore = true;

    // Create a unique context for Apollo cache differentiation
    const contextParts = [
      this.config.titlePrefix.replace(/\s+/g, ''),
      this.type,
      this.config.sortType?.[0] || 'default'
    ];
    if (this.config.format) {
      contextParts.push(this.config.format);
    }
    if (this.config.status) {
      contextParts.push(this.config.status);
    }
    const context = contextParts.join('_');

    const variables: any = {
      type: this.type?.toUpperCase(),
      page: this.page,
      sort: this.config.sortType,
      perPage: this.perPage,
      context: context
    };

    // Add format if specified in config
    if (this.config.format) {
      variables.format = this.config.format;
    }

    // Add status if specified in config
    if (this.config.status) {
      variables.status = this.config.status;
    }

    // Determine if we should hide adult content
    const hideAdultContent = this.authService.getUserData()?.options?.displayAdultContent !== true;

    // Use search method which has network-only fetch policy for proper pagination
    this.apiService
      .search(GET_MEDIA_LIST, variables, true, hideAdultContent)
      .pipe(take(1))
      .subscribe({
        next: ({ data, errors }) => {
          this.loading = false;

          if (!errors) {
            const newEdges = data?.Page?.media ?? [];
            for (const e of newEdges) {
              const id = e?.id;
              if (id && !this.mediaIdSet.has(id)) {
                this.mediaIdSet.add(id);
                this.mediaEdges.push(e);
              }
            }

            const pageInfo = data?.Page?.pageInfo;
            this.page = this.page + 1;
            this.hasNextPage = !!pageInfo?.hasNextPage;
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
        error: (err) => {
          console.error('Error loading more media:', err);
          this.loading = false;
          this.loadingMore = false;
          event?.target?.complete();
        }
      });
  }

  private async showErrorToast(message: string) {
    // Use ToastService with alerts for reliable notifications
    await this.toastService.error(message);
  }
}
