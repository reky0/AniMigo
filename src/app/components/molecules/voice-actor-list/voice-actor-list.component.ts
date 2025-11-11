import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from "@ionic/angular";
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

  constructor(private modalController: ModalController) { }

  openModal(id: number) {
    // Dismiss the modal and pass the staff ID back
    this.modalController.dismiss({
      staffId: id
    });
  }
}
