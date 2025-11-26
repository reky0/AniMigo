import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from '@components/core/services/api.service';
import { AuthService } from '@components/core/services/auth.service';
import { CharacterItemComponent } from "@components/molecules/character-item/character-item.component";
import { IonicModule } from "@ionic/angular";
import { take } from 'rxjs';
import { getPreferredCharacterName, getPreferredTitle, toSentenceCase } from 'src/app/helpers/utils';
import { GET_STAFF_VA_CHARACTERS } from 'src/app/models/aniList/mediaQueries';
import { Character, Staff } from 'src/app/models/aniList/responseInterfaces';
import { RangePipe } from "../../../helpers/range.pipe";
@Component({
  selector: 'am-people-va-tab',
  templateUrl: './people-va-tab.component.html',
  styleUrls: ['./people-va-tab.component.scss'],
  imports: [IonicModule, CharacterItemComponent, RangePipe],
})
export class PeopleVATabComponent implements OnInit {
  @Input() data: Character | Staff | undefined;
  @Output() navigate = new EventEmitter<{ id: number, type: string, isAdult: boolean }>(); // Emit changes
  @Output() characterSelected = new EventEmitter<number>(); // Emit character ID to open modal

  toSentenceCase = toSentenceCase;
  getPreferredCharacterName = getPreferredCharacterName;
  getPreferredTitle = getPreferredTitle;

  // Accumulative state - now stores character-media pairs instead of unique characters
  characterMediaEdges: Array<any> = [];

  // Pagination state (read from initial data if present)
  currentPage = 1;
  perPage = 25;
  hasNextPage = true;
  loadingMore = false;
  firstLoading = false;

  constructor(
    private readonly apiService: ApiService,
    public readonly authService: AuthService
  ) { }

  ngOnInit() {
    // Start from page 0 so first loadMore fetches page 1
    this.currentPage = 0;
    this.hasNextPage = true;

    // Trigger initial load
    this.loadMore(null);
  }

  isCharacter(data: Character | Staff): data is Character {
    return 'media' in data && 'edges' in (data as Character).media;
  }

  triggerNavigationEvent(type: 'ANIME' | 'MANGA', id: number, isAdult: boolean | null | undefined) {
    this.navigate.emit({ type: type.toLowerCase(), id: id, isAdult: isAdult ?? false });
  }

  onCharacterClick(characterId: number) {
    this.characterSelected.emit(characterId);
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

    this.apiService.fetchStaffById(GET_STAFF_VA_CHARACTERS, variables)
      .pipe(take(1))
      .subscribe({
        next: ({ data, errors }) => {
          this.handleCharacterResponse(
            data?.Staff?.characterMedia?.edges,
            data?.Staff?.characterMedia?.pageInfo,
            errors,
            event
          );
        },
        error: () => this.completeLoadMore(event)
      });
  }

  private handleCharacterResponse(edges: any[] | undefined, pageInfo: any, errors: any, event: any) {
    if (!errors) {
      const newEdges = edges ?? [];

      // Add all edges to accumulated list (allowing duplicates for same character in different media)
      this.characterMediaEdges.push(...newEdges);

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

  getCharacterNote(edge: any): string {
    const mediaTitle = this.getPreferredTitle(
      edge.node?.title,
      this.authService.getUserData()?.options?.titleLanguage
    );
    const role = edge.characterRole ? this.toSentenceCase(edge.characterRole) : '';

    if (role && mediaTitle) {
      return `${role} • ${mediaTitle}`;
    }
    return mediaTitle || role || '';
  }
}
