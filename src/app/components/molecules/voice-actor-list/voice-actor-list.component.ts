import { Component, Input } from '@angular/core';
import { AuthService } from '@components/core/services/auth.service';
import { IonicModule, ModalController } from "@ionic/angular";
import { getPreferredCharacterName } from 'src/app/helpers/utils';
import { VoiceActor } from 'src/app/models/aniList/responseInterfaces';
import { PersonItemComponent } from "../person-item/person-item.component";

@Component({
  selector: 'am-voice-actor-list',
  templateUrl: './voice-actor-list.component.html',
  styleUrls: ['./voice-actor-list.component.scss'],
  imports: [PersonItemComponent, IonicModule],
})

export class VoiceActorListComponent  {
  @Input() data: Array<VoiceActor> | undefined;

  getPreferredCharacterName = getPreferredCharacterName;

  constructor(
    private modalController: ModalController,
    public readonly authService: AuthService
  ) { }

  openModal(id: number) {
    // Dismiss the modal and pass the staff ID back
    this.modalController.dismiss({
      staffId: id
    });
  }
}
