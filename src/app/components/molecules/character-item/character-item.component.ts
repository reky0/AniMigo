import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlatformService } from '@components/core/services/platform.service';
import { IonicModule, ModalController, ModalOptions, PopoverController } from '@ionic/angular';
import { VoiceActor } from 'src/app/models/aniList/responseInterfaces';
import { PersonItemComponent } from '../person-item/person-item.component';
import { VoiceActorListComponent } from '../voice-actor-list/voice-actor-list.component';

@Component({
  selector: 'am-character-item',
  templateUrl: './character-item.component.html',
  styleUrls: ['./character-item.component.scss'],
  imports: [PersonItemComponent, IonicModule],
})
export class CharacterItemComponent extends PersonItemComponent {
  @Input() voiceActors: Array<VoiceActor> | null | undefined = null;
  @Output() voiceActorSelected = new EventEmitter<number>();

  platformService: PlatformService;

  constructor(private modalController: ModalController,
    private popoverController: PopoverController,
    platformService: PlatformService
  ) {
  // constructor() {
    super()
    this.platformService = platformService;
  }

  async openModal(event?: Event) {
    // Prevent the click event from bubbling up to the parent
    if (event) {
      event.stopPropagation();
    }

    try {
      // Check if device supports touch
      const isTouchDevice = this.platformService.isTouchDevice();

      const modalConfig: ModalOptions = {
        component: VoiceActorListComponent,
        componentProps: {
          data: this.voiceActors
        },
        backdropDismiss: true,
        backdropBreakpoint: 0,
        breakpoints: [0, 1],
        initialBreakpoint: 1,
        cssClass: "va-modal",
        handle: true,
        canDismiss: async (data?: any, role?: string) => {
          // Allow dismiss via backdrop or gesture (swipe from handle)
          return role === 'backdrop';
        }
      };

      if (!isTouchDevice) {
        // Non-touch devices (desktop): full height modal with scrollable content
        modalConfig.cssClass = "va-modal va-modal-desktop";
      }

      const modal = await this.modalController.create(modalConfig).catch(err => {
        console.error("CREATE ERROR:", err);
        throw err;
      });

      // Add class to body to prevent background scroll
      document.body.classList.add('modal-open');

      await modal.present();

      // Wait for the modal to be dismissed and check if data was returned
      const { data } = await modal.onWillDismiss();

      // Remove class from body to restore background scroll
      document.body.classList.remove('modal-open');

      if (data && data.staffId) {
        // Emit the staff ID to the parent component
        this.voiceActorSelected.emit(data.staffId);
      }
    } catch (error) {
      console.error("=== MODAL ERROR ===", error);
      console.error("Error type:", typeof error);
      console.error("Error message:", error);
      console.error("Error stack:", error);
    }
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: VoiceActorListComponent,
      componentProps: {
        data: this.voiceActors
      },
      event: ev, // Pass the event for correct positioning
      translucent: true,
      cssClass: 'va-popover',
    });

    await popover.present();
  }
}
