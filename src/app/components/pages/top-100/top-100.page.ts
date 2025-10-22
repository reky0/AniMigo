import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonInfiniteScroll, IonInfiniteScrollContent, IonButtons, IonBackButton, IonSkeletonText } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@components/core/services/api-service';
import { Title } from '@angular/platform-browser';
import { toSentenceCase } from 'src/app/helpers/utils';
import { BasicMedia } from 'src/app/models/aniList/responseInterfaces';
import { GET_TOP_MEDIA } from 'src/app/models/aniList/mediaQueries';
import { take } from 'rxjs';
import { MediaListItemComponent } from "@components/molecules/media-list-item/media-list-item.component";
import { IonicModule } from "@ionic/angular";
import { RangePipe } from "../../../helpers/range.pipe";

@Component({
  selector: 'app-top-100',
  templateUrl: './top-100.page.html',
  styleUrls: ['./top-100.page.scss'],
  standalone: true,
  imports: [IonRow, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonGrid, IonCol, MediaListItemComponent, IonInfiniteScroll, IonInfiniteScrollContent, IonButtons, IonBackButton, RangePipe, IonSkeletonText],
})
export class Top100Page implements OnInit {

  constructor(
    private readonly apiService: ApiService,
    private readonly route: ActivatedRoute,
    private readonly titleService: Title,
    private readonly router: Router
  ) { }

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

  ngOnInit() {
    this.type = this.route.snapshot.paramMap.get("type");

    this.titleService.setTitle(`Top 100 ${this.toSentenceCase(this.type)} · AniMigo`);

    this.loadMore()
  }

  goToDetails(id: number) {
    setTimeout(() => {
      this.router.navigate(['media', this.type, id])
    }, 100);
  }

  async loadMore(event?: any) {
    if (this.loadingMore || !this.hasNextPage) {
      event?.target?.complete();
      console.log('end');

      return;
    }

    this.loadingMore = true;

    const variables = {
      type: this.type?.toUpperCase(),
      page: this.page,
      perPage: this.perPage,
      isAdult: false
    };

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
            if (this.mediaEdges.length >= 100) {
              event.target.disabled = true;
            }
          }
        },
        error: () => {
          this.loadingMore = false;
          event?.target.complete();
          console.log('end');
        }
      });
  }

}
