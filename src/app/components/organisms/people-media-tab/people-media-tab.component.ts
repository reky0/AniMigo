import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from '@components/core/services/api.service';
import { MediaListItemComponent } from "@components/molecules/media-list-item/media-list-item.component";
import { IonicModule } from "@ionic/angular";
import { take } from 'rxjs';
import { toSentenceCase } from 'src/app/helpers/utils';
import { GET_CHARACTER_MEDIA, GET_STAFF_MEDIA_STAFF } from 'src/app/models/aniList/mediaQueries';
import { Character, Staff } from 'src/app/models/aniList/responseInterfaces';
@Component({
  selector: 'am-people-media-tab',
  templateUrl: './people-media-tab.component.html',
  styleUrls: ['./people-media-tab.component.scss'],
  imports: [IonicModule, MediaListItemComponent],
})
export class PeopleMediaTabComponent implements OnInit {
  // TODO: Add same functionality for voice actors too
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

  // TODO: Add same functionality for staff and voice actors too
  async loadMore(event: any) {

    if (this.loadingMore || !this.hasNextPage || !this.data?.id) {

      event?.target?.complete();
      return;
    }

    this.loadingMore = true;

    const variables = {
      id: this.data.id,
    };

    if (this.isCharacter(this.data)) {
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
            event?.target?.complete();
            if (!this.hasNextPage && event?.target) {
              event.target.disabled = true;
            }
          },
          error: () => {
            this.loadingMore = false;
            event?.target?.complete();
          }
        });
    } else {
      this.apiService
        .fetchStaffById(GET_STAFF_MEDIA_STAFF, variables)
        .pipe(take(1))
        .subscribe({
          next: ({ data, errors }) => {
            if (!errors) {
              const newEdges = data?.Staff?.staffMedia?.edges ?? [];
              for (const e of newEdges) {
                const id = e?.node?.id;
                if (id && !this.mediaIdSet.has(id)) {
                  this.mediaIdSet.add(id);
                  this.mediaEdges.push(e);
                }
              }

              const pageInfo = data?.Staff?.staffMedia?.pageInfo;
              this.currentPage = pageInfo?.currentPage ?? this.currentPage + 1;
              this.hasNextPage = !!pageInfo?.hasNextPage;
            }

            this.loadingMore = false;
            event?.target?.complete();
            if (!this.hasNextPage && event?.target) {
              event.target.disabled = true;
            }
          },
          error: () => {
            this.loadingMore = false;
            event?.target?.complete();
          }
        });
    }
  }
}
