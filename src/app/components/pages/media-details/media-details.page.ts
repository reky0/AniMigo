import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CoverImageComponent } from "@components/atoms/cover-image/cover-image.component";
import { InfoChipComponent } from "@components/atoms/info-chip/info-chip.component";
import { MetaItemComponent } from "@components/atoms/meta-item/meta-item.component";
import { SectionTitleComponent } from "@components/atoms/section-title/section-title.component";
import { ApiService } from '@components/core/services/api.service';
import { ToastService } from '@components/core/services/toast.service';
import { CollapsibleComponent } from "@components/molecules/collapsible/collapsible.component";
import { InfoTabComponent } from "@components/organisms/info-tab/info-tab.component";
import { PeopleTabComponent } from "@components/organisms/people-tab/people-tab.component";
import { RelationsTabComponent } from "@components/organisms/relations-tab/relations-tab.component";
import { StatsTabComponent } from "@components/organisms/stats-tab/stats-tab.component";
import { IonBackButton, IonBackdrop, IonBadge, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonModal, IonRow, IonSegment, IonSegmentButton, IonSkeletonText, IonSpinner, IonText, IonToolbar } from '@ionic/angular/standalone';
import { Subscription, take } from 'rxjs';
import { toSentenceCase } from 'src/app/helpers/utils';
import { GET_MEDIA_BY_ID } from 'src/app/models/aniList/mediaQueries';
import { DetailedMedia } from 'src/app/models/aniList/responseInterfaces';
import { RangePipe } from "../../../helpers/range.pipe";

@Component({
  selector: 'am-profile-tab',
  templateUrl: './media-details.page.html',
  styleUrls: ['./media-details.page.scss'],
  standalone: true,
  imports: [IonSpinner, IonModal, IonSegmentButton, IonSegment, IonBackdrop, IonImg, IonRow, IonGrid, IonIcon, IonBackButton, IonButtons, IonButton, IonSkeletonText, IonCol, IonText, IonContent, IonHeader, IonToolbar, CommonModule, FormsModule, SectionTitleComponent, InfoChipComponent, MetaItemComponent, CoverImageComponent, CollapsibleComponent, InfoTabComponent, PeopleTabComponent, RelationsTabComponent, StatsTabComponent, RangePipe, IonBadge],
})
export class MediaDetailsPageComponent implements OnDestroy {

  constructor(
    private readonly apiService: ApiService,
    private readonly route: ActivatedRoute,
    private readonly titleService: Title,
    private readonly toastService: ToastService
  ) { }

  loading = true;
  error: any;
  data: DetailedMedia | null | undefined = null;
  selectedTab: string = 'info';
  isTogglingFavorite: boolean = false;
  private dataSubscription?: Subscription;

  ionViewWillEnter() {
    this.toastService.setTabBarVisibility(false);
    this.loadMediaData();
  }

  private loadMediaData() {
    const id = this.route.snapshot.paramMap.get("id");
    const type = this.route.snapshot.paramMap.get("type");

    // Reset state when loading new data
    this.loading = true;
    this.error = null;
    this.data = null;

    let variables = {
      id: Number(id),
      type: type?.toUpperCase()
    };

    this.dataSubscription?.unsubscribe();
    this.dataSubscription = this.apiService.fetchDetailedData(GET_MEDIA_BY_ID, variables).subscribe({
      next: ({ data, loading, errors }) => {
        this.loading = loading;
        if (errors) {
          this.error = errors[0];
        } else {
          this.data = data?.Media;

          // Set title after data is loaded
          if (data?.Media) {
            const title = `${data.Media.title.romaji}${data.Media.title.english ? ` (${data.Media.title.english})` : ''} · AniMigo`;
            this.titleService.setTitle(title);
          }
        }
      },
      error: (err) => {
        this.error = err;
        this.loading = false;
      }
    });
  }

  ngOnDestroy() {
    this.dataSubscription?.unsubscribe();
  }

  toSentenceCase = toSentenceCase;

  secondsToDays(seconds: number | null | undefined): number {
    if (!seconds) return -1;

    const secondsPerDay = 24 * 60 * 60; // 86400 seconds in a day
    return Math.floor(seconds / secondsPerDay);
  }

  onSegmentChange(event: any) {
    this.selectedTab = event.detail.value as string;
  }

  selectedImg: string = '';
  showModal = false;

  zoomImg(img: string | null | undefined) {
    this.selectedImg = img || '';
    this.showModal = true;
  }

  onImageError() {
    this.selectedImg = this.selectedImg.replace('large', 'medium');
  }

  closeModal() {
    this.showModal = false;
  }

  toggleMediaFavorite() {
    if (!this.data?.id || this.isTogglingFavorite) return;

    this.isTogglingFavorite = true;

    this.apiService.toggleFavoriteMedia(this.data.id, this.data.type)
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.isTogglingFavorite = false;
          if (result.success && this.data) {
            // Update local state by creating a new object
            this.data = {
              ...this.data,
              isFavourite: result.isFavorite
            };
          }
        },
        error: () => {
          this.isTogglingFavorite = false;
        }
      });
  }
}
