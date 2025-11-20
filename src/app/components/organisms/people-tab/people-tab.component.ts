import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';
import { SectionTitleComponent } from "@components/atoms/section-title/section-title.component";
import { ApiService } from '@components/core/services/api.service';
import { AuthService } from '@components/core/services/auth.service';
import { ToastService } from '@components/core/services/toast.service';
import { CharacterItemComponent } from "@components/molecules/character-item/character-item.component";
import { CollapsibleComponent } from "@components/molecules/collapsible/collapsible.component";
import { PersonItemComponent } from "@components/molecules/person-item/person-item.component";
import {
    IonButton,
    IonButtons,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonModal,
    IonRow,
    IonSegment,
    IonSegmentButton,
    IonSpinner,
    IonToolbar
} from "@ionic/angular/standalone";
import { take } from 'rxjs';
import { RangePipe } from 'src/app/helpers/range.pipe';
import { getPreferredCharacterName } from 'src/app/helpers/utils';
import { GET_CHARACTER_BY_ID, GET_STAFF_BY_ID } from 'src/app/models/aniList/mediaQueries';
import { Character, DetailedMedia, Staff } from 'src/app/models/aniList/responseInterfaces';
import { PeopleInfoTabComponent } from "../people-info-tab/people-info-tab.component";
import { PeopleMediaTabComponent } from "../people-media-tab/people-media-tab.component";
import { PeopleVATabComponent } from "../people-va-tab/people-va-tab.component";

@Component({
  selector: 'am-people-tab',
  templateUrl: './people-tab.component.html',
  styleUrls: ['./people-tab.component.scss'],
  imports: [IonButton,
    IonButtons,
    IonToolbar,
    IonHeader,
    RangePipe,
    IonRow,
    IonGrid,
    IonCol,
    SectionTitleComponent,
    PersonItemComponent,
    CollapsibleComponent,
    CharacterItemComponent,
    IonModal,
    IonContent,
    FormsModule,
    IonSegment,
    IonSegmentButton,
    IonIcon,
    IonSpinner,
    PeopleInfoTabComponent,
    PeopleMediaTabComponent,
    PeopleVATabComponent
  ],
})
export class PeopleTabComponent implements OnInit {
  @Input() data: DetailedMedia | null | undefined = undefined;
  @Input() loading: boolean = true;
  @ViewChild(IonModal) modal!: IonModal;

  getPreferredCharacterName = getPreferredCharacterName;

  isModalOpen: boolean;
  modalSelectedTab: string; // info | media | va
  modalData: Character | Staff | undefined;
  error: any;
  isTogglingFavorite: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    readonly authService: AuthService,
    private readonly toastService: ToastService
  ) {
    this.isModalOpen = false;
    this.modalSelectedTab = 'info';
  }

  ngOnInit(): void {
    this.toastService.setTabBarVisibility(false);
  }

  isCharacter(data: Character | Staff | undefined): data is Character {
    if (!data) return false;
    return 'media' in data && 'edges' in (data as Character).media;
  }

  openModal(type: 'staff' | 'character' | 'va', id: number) {
    let variables = {
      id: id
    }

    switch (type) {
      case ('character'):
        this.apiService.fetchCharacterById(GET_CHARACTER_BY_ID, variables).subscribe({
          next: ({ data, loading, errors }) => {
            this.loading = loading;
            if (errors) {
              this.error = errors[0];
            } else {
              this.modalData = data?.Character;
              this.modalSelectedTab = 'info';
              this.isModalOpen = true;
            }
          },
          error: (err) => {
            this.error = err;
            this.loading = false;
          }
        });
        break;
      default:
        this.apiService.fetchStaffById(GET_STAFF_BY_ID, variables).subscribe({
          next: ({ data, loading, errors }) => {
            this.loading = loading;
            if (errors) {
              this.error = errors[0];
            } else {
              this.modalData = data?.Staff;
              this.modalSelectedTab = 'info';
              this.isModalOpen = true;
            }
          },
          error: (err) => {
            this.error = err;
            this.loading = false;
          }
        });
        break;

    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.modalSelectedTab = 'info';
  }

  onSegmentChange(event: any) {
    this.modalSelectedTab = event.detail.value as string;
  }

  goToDetails(data: { id: number, type: string, isAdult: boolean }) {
    if (data.isAdult && !this.authService.getUserData()?.options?.displayAdultContent) {
      this.showErrorToast("Oops, your settings don't allow me to show you that! (Adult content warning)")
    } else {
      this.closeModal();

      setTimeout(() => {
        this.router.navigate(['media', data.type, data.id])
      }, 100);
    }
  }

  toggleCharacterFavorite() {
    if (!this.modalData?.id || this.isTogglingFavorite) return;

    this.isTogglingFavorite = true;
    const previousState = this.modalData.isFavourite;

    this.apiService.toggleFavoriteCharacter(this.modalData.id, true, previousState as boolean)
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.isTogglingFavorite = false;
          if (result.success && this.modalData) {
            // Update local state by creating a new object
            this.modalData = {
              ...this.modalData,
              isFavourite: result.isFavorite
            };
          }
        },
        error: () => {
          this.isTogglingFavorite = false;
        }
      });
  }

  toggleStaffFavorite() {
    if (!this.modalData?.id || this.isTogglingFavorite) return;

    this.isTogglingFavorite = true;
    const previousState = this.modalData.isFavourite;

    this.apiService.toggleFavoriteStaff(this.modalData.id, true, previousState as boolean)
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.isTogglingFavorite = false;
          if (result.success && this.modalData) {
            // Update local state by creating a new object
            this.modalData = {
              ...this.modalData,
              isFavourite: result.isFavorite
            };
          }
        },
        error: () => {
          this.isTogglingFavorite = false;
        }
      });
  }

  private async showErrorToast(message: string) {
    // Use ToastService with alerts for reliable notifications
    await this.toastService.error(message);
  }
}
