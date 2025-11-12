import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from '@components/core/services/api.service';
import { MediaListItemComponent } from "@components/molecules/media-list-item/media-list-item.component";
import { IonicModule } from "@ionic/angular";
import { take } from 'rxjs';
import { toSentenceCase } from 'src/app/helpers/utils';
import { GET_CHARACTER_MEDIA, GET_STAFF_MEDIA_STAFF } from 'src/app/models/aniList/mediaQueries';
import { Character, Staff } from 'src/app/models/aniList/responseInterfaces';
import { RangePipe } from "../../../helpers/range.pipe";
@Component({
  selector: 'am-people-media-tab',
  templateUrl: './people-media-tab.component.html',
  styleUrls: ['./people-media-tab.component.scss'],
  imports: [IonicModule, MediaListItemComponent, RangePipe],
})
export class PeopleMediaTabComponent implements OnInit {
  @Input() data: Character | Staff | undefined;
  @Output() navigate = new EventEmitter<{ id: number, type: string, isAdult: boolean }>(); // Emit changes

  toSentenceCase = toSentenceCase;
  media: Array<any> = [];

  // Accumulative state
  mediaEdges: Array<any> = [];
  private mediaIdSet = new Set<number>();

  // Pagination state (read from initial data if present)
  currentPage = 1;
  perPage = 25;
  hasNextPage = true;
  loadingMore = false;
  firstLoading = false;

  constructor(private readonly apiService: ApiService) { }

  ngOnInit() {
    // Start from page 0 so first loadMore fetches page 1
    this.currentPage = 0;
    this.hasNextPage = true;

    // Trigger initial load
    this.loadMore(null);

    // if (this.data) {
    //   if (this.isCharacter(this.data)) {
    //     this.media = this.data.media?.edges.map(edge => edge.node) ?? [];
    //   } else {
    //     this.media = this.data.staffMedia?.nodes ?? [];
    //   }
    // }
  }

  isCharacter(data: Character | Staff): data is Character {
    return 'media' in data && 'edges' in (data as Character).media;
  }

  triggerNavigationEvent(type: 'ANIME' | 'MANGA', id: number, isAdult: boolean | null | undefined) {
    this.navigate.emit({ type: type.toLowerCase(), id: id, isAdult: isAdult ?? false });
  }

  async loadMore(event: any) {
    if (this.loadingMore || !this.hasNextPage || !this.data?.id) {
      event?.target?.complete();
      return;
    }

    if (event === null) {
      this.firstLoading = true;
    }

    this.loadingMore = true;

    const variables = { id: this.data.id, page: this.currentPage+1, perPage: this.perPage };

    if (this.isCharacter(this.data)) {
      this.apiService.fetchCharacterById(GET_CHARACTER_MEDIA, variables)
        .pipe(take(1))
        .subscribe({
          next: ({ data, errors }) => {
            this.handleMediaResponse(
              data?.Character?.media?.edges,
              data?.Character?.media?.pageInfo,
              errors,
              event
            );
          },
          error: () => this.completeLoadMore(event)
        });
    } else {
      this.apiService.fetchStaffById(GET_STAFF_MEDIA_STAFF, variables)
        .pipe(take(1))
        .subscribe({
          next: ({ data, errors }) => {
            this.handleMediaResponse(
              data?.Staff?.staffMedia?.edges,
              data?.Staff?.staffMedia?.pageInfo,
              errors,
              event
            );
          },
          error: () => this.completeLoadMore(event)
        });
    }
  }

  private handleMediaResponse(edges: any[] | undefined, pageInfo: any, errors: any, event: any) {
    if (!errors) {
      const newEdges = edges ?? [];

      // Add unique edges to accumulated list
      for (const edge of newEdges) {
        const id = edge?.node?.id;
        if (id && !this.mediaIdSet.has(id)) {
          this.mediaIdSet.add(id);
          this.mediaEdges.push(edge);
        }
      }

      // Update pagination state
      this.currentPage = pageInfo?.currentPage ?? this.currentPage + 1;
      this.hasNextPage = !!pageInfo?.hasNextPage;
    }

    this.completeLoadMore(event);
  }

  private completeLoadMore(event: any) {
    this.loadingMore = false;
    this.firstLoading = false;
    event?.target?.complete();
    if (!this.hasNextPage && event?.target) {
      event.target.disabled = true;
    }
  }
}
