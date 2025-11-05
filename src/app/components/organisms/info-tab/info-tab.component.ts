import { Component, Input, OnInit } from '@angular/core';
import { InfoChipComponent } from "@components/atoms/info-chip/info-chip.component";
import { MediaThumbnailComponent } from "@components/atoms/media-thumbnail/media-thumbnail.component";
import { CollapsibleComponent } from "@components/molecules/collapsible/collapsible.component";
import { IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonNote, IonRow, IonSkeletonText, IonText } from "@ionic/angular/standalone";
import { RangePipe } from 'src/app/helpers/range.pipe';
import { formatDate, getLangCode, openUrl, toSentenceCase } from 'src/app/helpers/utils';
import { DetailedMedia } from 'src/app/models/aniList/responseInterfaces';

@Component({
  selector: 'am-info-tab',
  templateUrl: './info-tab.component.html',
  styleUrls: ['./info-tab.component.scss'],
  imports: [IonGrid, IonRow, IonNote, IonCol, IonText, IonCardSubtitle, IonCardTitle, InfoChipComponent, MediaThumbnailComponent, CollapsibleComponent, IonSkeletonText, RangePipe]
})
export class InfoTabComponent implements OnInit {
  @Input() data: DetailedMedia | null | undefined = undefined;
  @Input() loading: boolean = true;

  mainStudios: any;
  otherStudios: any;
  trailerURL: string | undefined;
  streamingSites: Array<{
    id: number;
    url: string;
    site: string;
    type?: string | null;
    language?: string | null;
    color?: string | null;
    icon?: string | null;
    isDisabled?: boolean | null;
    notes?: string | null;
    siteId?: string | null;
  }> | null | undefined;

  externalLinks: Array<{
    id: number;
    url: string;
    site: string;
    type?: string | null;
    language?: string | null;
    color?: string | null;
    icon?: string | null;
    isDisabled?: boolean | null;
    notes?: string | null;
    siteId?: string | null;
  }> | null | undefined;

  openUrl = openUrl;
  getLangCode = getLangCode;
  formatDate = formatDate;
  toSentenceCase = toSentenceCase;

  constructor() { }

  ngOnInit() {
    this.mainStudios = this.data?.studios?.edges.filter(studio => studio.isMain);
    this.otherStudios = this.data?.studios?.edges.filter(studio => !studio.isMain);

    switch (this.data?.trailer?.site) {
      case "youtube":
        this.trailerURL = `https://www.youtube.com/watch?v=${this.data.trailer.id}`
        break;
      case "dailymotion":
        this.trailerURL = `https://www.dailymotion.com/video/${this.data.trailer.id}`
        break;
    }

    if (this.data?.streamingEpisodes) {
      this.streamingSites = this.data.externalLinks?.filter(link => link.type === 'STREAMING')
      this.externalLinks = this.data.externalLinks?.filter(link => link.type !== 'STREAMING')
    }
  }
}

interface themeLinks {
  youtube: string;
  spotify: string;
  ytMusic: string;
  appleMusic: string;
  deezer: string;
}
