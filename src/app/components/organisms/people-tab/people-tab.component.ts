import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { SectionTitleComponent } from "@components/atoms/section-title/section-title.component";
import { CharacterItemComponent } from "@components/molecules/character-item/character-item.component";
import { CollapsibleComponent } from "@components/molecules/collapsible/collapsible.component";
import { PersonItemComponent } from "@components/molecules/person-item/person-item.component";
import {
  IonBackButton,
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
  IonToolbar, IonButton, IonSkeletonText, IonSpinner
} from "@ionic/angular/standalone";
import { RangePipe } from 'src/app/helpers/range.pipe';
import { Character, DetailedMedia, VoiceActor } from 'src/app/models/aniList/responseInterfaces';
import { PeopleInfoTabComponent } from "../people-info-tab/people-info-tab.component";
import { PeopleMediaTabComponent } from "../people-media-tab/people-media-tab.component";
import { PeopleVATabComponent } from "../people-va-tab/people-va-tab.component";
import { ApiService } from '@components/core/services/api.service';
import { GET_CHARACTER_BY_ID } from 'src/app/models/aniList/mediaQueries';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from '@components/core/services/auth.service';
import { ToastController } from '@ionic/angular';

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
export class PeopleTabComponent implements OnInit {
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

  ngOnInit() { }



  openModal(type: 'staff' | 'character' | 'va', id: number) {
    let variables= {
      id: id
    }

    console.log(variables);

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
              console.log(this.modalData);
              this.isModalOpen = true;
              // console.log(this.data?.description);
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

    console.log('Modal tab changed to: ' + this.modalSelectedTab);
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
            console.log('fav operation success');

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
    console.log(message);

    await toast.present();
  }
}
