import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StatusBar, Style } from '@capacitor/status-bar';
import { CoverImageComponent } from "@components/atoms/cover-image/cover-image.component";
import { InfoChipComponent } from "@components/atoms/info-chip/info-chip.component";
import { MetaItemComponent } from "@components/atoms/meta-item/meta-item.component";
import { SectionTitleComponent } from "@components/atoms/section-title/section-title.component";
import { ApiService } from '@components/core/services/api-service';
import { CollapsibleComponent } from "@components/molecules/collapsible/collapsible.component";
import { InfoTabComponent } from "@components/organisms/info-tab/info-tab.component";
import { PeopleTabComponent } from "@components/organisms/people-tab/people-tab.component";
import { RelationsTabComponent } from "@components/organisms/relations-tab/relations-tab.component";
import { StatsTabComponent } from "@components/organisms/stats-tab/stats-tab.component";
import { IonBackButton, IonBackdrop, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonRow, IonSegment, IonSegmentButton, IonSkeletonText, IonText, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { gitNetworkOutline, heart, images, informationCircle, people, radio, shareSocial, shuffle, star, statsChart, time, tv, tvOutline } from 'ionicons/icons';
import { toSentenceCase } from 'src/app/helpers/utils';
import { GET_MEDIA_BY_ID } from 'src/app/models/aniList/mediaQueries';
import { DetailedMedia } from 'src/app/models/aniList/responseInterfaces';
import { RangePipe } from "../../../helpers/range.pipe";

@Component({
  selector: 'app-profile-tab',
  templateUrl: './media-details.page.html',
  styleUrls: ['./media-details.page.scss'],
  standalone: true,
  imports: [IonSegmentButton, IonSegment, IonBackdrop, IonImg, IonRow, IonGrid, IonIcon, IonBackButton, IonButtons, IonButton, IonSkeletonText, IonCol, IonText, IonContent, IonHeader, IonToolbar, CommonModule, FormsModule, SectionTitleComponent, InfoChipComponent, MetaItemComponent, CoverImageComponent, CollapsibleComponent, InfoTabComponent, PeopleTabComponent, RelationsTabComponent, StatsTabComponent, RangePipe],
})
export class MediaDetailsPageComponent implements OnInit {

  constructor(private apiService: ApiService, private route: ActivatedRoute) {
    addIcons({heart,shareSocial,tvOutline,time,radio,informationCircle,people,shuffle,statsChart,images,gitNetworkOutline,star,tv,});
    this.setupStatusBar();
  }

  loading = true;
  error: any;
  data: DetailedMedia | null | undefined = null;
  selectedTab: string = 'info';
  // selectedTab: string = 'people';

  ngOnInit() {
    addIcons({shareSocial});

    const id = this.route.snapshot.paramMap.get("id");
    const type = this.route.snapshot.paramMap.get("type");

    console.log("MEDIA ID: " + Number(id));
    console.log("MEDIA TYPE: " + type);

    let variables = {
      id: Number(id),
      type: type?.toUpperCase()
    };

    this.apiService.fetchDetailedData(GET_MEDIA_BY_ID, variables).subscribe({
          next: ({ data, loading, errors }) => {
            this.loading = loading;
            if (errors) {
              this.error = errors[0];
            } else {
              this.data = data?.Media;
              // console.log(this.data);
              // console.log(this.data?.description);

            }
          },
          error: (err) => {
            this.error = err;
            this.loading = false;
          }
        });
  }

  toSentenceCase = toSentenceCase;

  secondsToDays(seconds: number | null | undefined): number {
    if (!seconds) return -1;

    const secondsPerDay = 24 * 60 * 60; // 86400 seconds in a day
    return Math.floor(seconds / secondsPerDay);
  }

  onSegmentChange(event: any) {
    this.selectedTab = event.detail.value as string;

    console.log('Tab changed to: ' + this.selectedTab);
  }

  async setupStatusBar() {
    await StatusBar.setOverlaysWebView({ overlay: true });
    await StatusBar.setStyle({ style: Style.Light });
  }
}
