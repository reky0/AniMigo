import { Component, Input, ViewChild } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';
import { SectionTitleComponent } from "@components/atoms/section-title/section-title.component";
import { ApiService } from '@components/core/services/api.service';
import { AuthService } from '@components/core/services/auth.service';
import { CharacterItemComponent } from "@components/molecules/character-item/character-item.component";
import { CollapsibleComponent } from "@components/molecules/collapsible/collapsible.component";
import { PersonItemComponent } from "@components/molecules/person-item/person-item.component";
import { ToastController } from '@ionic/angular';
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
import { GET_CHARACTER_BY_ID } from 'src/app/models/aniList/mediaQueries';
import { Character, DetailedMedia } from 'src/app/models/aniList/responseInterfaces';
import { PeopleInfoTabComponent } from "../people-info-tab/people-info-tab.component";
import { PeopleMediaTabComponent } from "../people-media-tab/people-media-tab.component";
import { PeopleVATabComponent } from "../people-va-tab/people-va-tab.component";

@Component({
  selector: 'app-people-tab',
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
export class PeopleTabComponent {
  @Input() data: DetailedMedia | null | undefined = undefined;
  @Input() loading: boolean = true;
  @ViewChild(IonModal) modal!: IonModal;

  isModalOpen: boolean;
  modalSelectedTab: string; // info | media | va
  modalData: Character | undefined;
  error: any;
  isTogglingFavorite: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private readonly authService: AuthService,
    private readonly toastController: ToastController
  ) {
    this.isModalOpen = false;
    this.modalSelectedTab = 'info';
  }

  openModal(type: 'staff' | 'character' | 'va', id: number) {
    let variables= {
      id: id
    }

    switch(type) {
      case('staff'):
        break;
      case('character'):
        this.apiService.fetchCharacterById(GET_CHARACTER_BY_ID, variables).subscribe({
          next: ({ data, loading, errors }) => {
            this.loading = loading;
            if (errors) {
              this.error = errors[0];
            } else {
              this.modalData = data?.Character;
              this.isModalOpen = true;
            }
          },
          error: (err) => {
            this.error = err;
            this.loading = false;
          }
        });
        break;
      case('va'):
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

  goToDetails(data: {id: number, type: string, isAdult: boolean}) {
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

    this.apiService.toggleFavoriteCharacter(this.modalData.id)
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
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      animated: true,
      icon: 'alert-circle',
      color: 'danger',
      position: 'bottom',
      cssClass: 'multiline-toast', // Add custom class
      swipeGesture: 'vertical'
    });

    await toast.present();
  }
}
