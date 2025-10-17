import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { toSentenceCase } from 'src/app/helpers/utils';
import { Character } from 'src/app/models/aniList/responseInterfaces';
import { ApiService } from '@components/core/services/api-service';
import { GET_CHARACTER_MEDIA } from 'src/app/models/aniList/mediaQueries';
import { take } from 'rxjs';
@Component({
  selector: 'app-people-media-tab',
  templateUrl: './people-media-tab.component.html',
  styleUrls: ['./people-media-tab.component.scss'],
  imports: [IonicModule],
})
export class PeopleMediaTabComponent implements OnInit {
  // TODO: Add same functionality for staff and voice actors too
  @Input() data: Character | undefined;
  @Output() navigate = new EventEmitter<{ id: number, type: string }>(); // Emit changes

  toSentenceCase = toSentenceCase;

  // Accumulative state
  mediaEdges: Array<any> = [];
  private mediaIdSet = new Set<number>();

  // Pagination state (read from initial data if present)
  currentPage = 1;
  perPage = 20;
  hasNextPage = false;
  loadingMore = false;

  constructor(private readonly apiService: ApiService) { }

  ngOnInit() {
    console.log(this.data);

    const edges = this.data?.media.edges ?? [];
    this.mediaEdges = [...edges];
    for (const e of edges) this.mediaIdSet.add(e?.node.id);

    const pageInfo = this.data?.media.pageInfo;
    if (pageInfo) {
      this.currentPage = pageInfo?.currentPage ?? 1;
      this.perPage = pageInfo?.perPage ?? 20;
      this.hasNextPage = pageInfo?.hasNextPage ?? false;
    }
  }

  triggerNavigationEvent(id: number, type: 'ANIME' | 'MANGA') {
    this.navigate.emit({ type: type.toLowerCase(), id: id });
  }

  // TODO: Add same functionality for staff and voice actors too
  async loadMore(event: any) {
    if (this.loadingMore || !this.hasNextPage || !this.data?.id) {
      event?.target?.complete();
      return;
    }

    this.loadingMore = true;

    const variables = {
      id: this.data.id,
      page: this.currentPage + 1,
      perPage: this.perPage,
    };

    this.apiService
      .fetchCharacterById(GET_CHARACTER_MEDIA, variables)
      .pipe(take(1))
      .subscribe({
        next: ({ data, errors }) => {
          if (!errors) {
            const newEdges = data?.Character?.media?.edges ?? [];
            for (const e of newEdges) {
              const id = e?.node?.id;
              if (id && !this.mediaIdSet.has(id)) {
                this.mediaIdSet.add(id);
                this.mediaEdges.push(e);
              }
            }

            const pageInfo = data?.Character?.media?.pageInfo;
            this.currentPage = pageInfo?.currentPage ?? this.currentPage + 1;
            this.hasNextPage = !!pageInfo?.hasNextPage;
          }

          this.loadingMore = false;
          event.target.complete();
          if (!this.hasNextPage) {
            event.target.disabled = true;
          }
        },
        error: () => {
          this.loadingMore = false;
          event.target.complete();
        }
      });
  }
}
