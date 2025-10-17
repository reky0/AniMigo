import { Component, Input, OnInit } from '@angular/core';
import { PlatformService } from '@components/core/services/platform-service';
import { IonicModule, ModalController, PopoverController } from '@ionic/angular';
import { VoiceActor } from 'src/app/models/aniList/responseInterfaces';
import { PersonItemComponent } from '../person-item/person-item.component';
import { VoiceActorListComponent } from '../voice-actor-list/voice-actor-list.component';

@Component({
  selector: 'app-character-item',
  templateUrl: './character-item.component.html',
  styleUrls: ['./character-item.component.scss'],
  imports: [PersonItemComponent, IonicModule],
})
export class CharacterItemComponent extends PersonItemComponent implements OnInit {
  @Input() voiceActors: Array<VoiceActor> | null | undefined = null;

  platformService: PlatformService;

  constructor(private modalController: ModalController,
    private popoverController: PopoverController,
    platformService: PlatformService
  ) {
  // constructor() {
    super()
    this.platformService = platformService;
  }

  override ngOnInit() {}

  async openModal() {
    console.log("=== MODAL START ===");
    console.log("Voice actors data:", this.voiceActors);
    console.log("ModalController exists:", !!this.modalController);

    try {
      console.log("About to create modal...");

      const modal = await this.modalController.create({
        component: VoiceActorListComponent,
        componentProps: {
          data: this.voiceActors
        },
        breakpoints: [0, 0.5, 0.8, 1],   // modal heights
        initialBreakpoint: 0.8,           // start in the middle (50%)
        backdropBreakpoint: 0.3,          // optional: when to close on swipe down
        handle: true,
        // canDismiss: true,
        cssClass: "va-modal"
      }).catch(err => {
        console.error("CREATE ERROR:", err);
        throw err;
      });

      console.log("Modal created successfully:", modal);

      await modal.present();
      console.log("Modal presented");
    } catch (error) {
      console.error("=== MODAL ERROR ===", error);
      console.error("Error type:", typeof error);
      console.error("Error message:", error);
      console.error("Error stack:", error);
    }
  }

  async presentPopover(ev: any) {
    console.log("Popover triggered.");

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
