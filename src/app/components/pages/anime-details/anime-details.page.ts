import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSkeletonText, IonText, IonImg, IonRow, IonCol, IonGrid, IonButton, IonButtons, IonBackButton, IonIcon, IonBackdrop, IonLabel, IonChip, IonCardTitle, IonCardSubtitle, IonCard, IonThumbnail, IonList, IonItem, IonNote, IonRouterOutlet, IonSegment, IonSegmentButton, IonTab } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@components/core/services/api-service';
import { GET_MEDIA_BY_ID } from 'src/app/models/aniList/mediaQueries';
import { DetailedMedia } from 'src/app/models/aniList/responseInterfaces';
import { shareSocial, heart, tv, radio, time, tvOutline, star, informationCircle, people, gitNetworkOutline, statsChart, images, shuffle } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { InfoChipComponent } from "@components/atoms/info-chip/info-chip.component";
import { InfoTabComponent } from "@components/organisms/info-tab/info-tab.component";
import { CharactersTabComponent } from "@components/organisms/characters-tab/characters-tab.component";
import { RelationsTabComponent } from "@components/organisms/relations-tab/relations-tab.component";
import { StatsTabComponent } from "@components/organisms/stats-tab/stats-tab.component";
import { CollapsibleComponent } from "@components/molecules/collapsible/collapsible.component";
import { toSentenceCase } from 'src/app/helpers/utils';

@Component({
  selector: 'app-anime-details',
  templateUrl: './anime-details.page.html',
  styleUrls: ['./anime-details.page.scss'],
  standalone: true,
  imports: [IonSegmentButton,
    IonSegment,
    IonItem,
    IonList,
    IonIcon,
    IonBackButton,
    IonCol,
    IonRow,
    IonImg,
    IonContent,
    IonHeader,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonSkeletonText,
    IonText,
    IonGrid,
    IonButton,
    IonButtons,
    IonBackdrop,
    IonCardTitle,
    InfoChipComponent,
    InfoTabComponent,
    CharactersTabComponent,
    RelationsTabComponent,
    StatsTabComponent,
    CollapsibleComponent]
})
export class AnimeDetailsPage implements OnInit {

  constructor(private apiService: ApiService, private route: ActivatedRoute) {
      addIcons({heart,shareSocial,tvOutline,time,radio,informationCircle,people,shuffle,statsChart,images,gitNetworkOutline,star,tv,}); }

  loading = true;
  error: any;
  data: DetailedMedia | null | undefined = null;
  selectedTab: string = 'info';

  ngOnInit() {
    addIcons({shareSocial});

    const id = this.route.snapshot.paramMap.get("id");

    console.log("ANIME ID: " + Number(id));

    let variables = {
      id: Number(id),
      type: "ANIME"
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
}
