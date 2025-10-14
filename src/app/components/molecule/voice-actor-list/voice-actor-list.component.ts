import { Component, Input, OnInit } from '@angular/core';
import { IonCol, IonGrid, IonRow, IonText } from "@ionic/angular/standalone";
import { VoiceActor } from 'src/app/models/aniList/responseInterfaces';
import { PersonItemComponent } from "../person-item/person-item.component";
import { IonicModule } from "@ionic/angular";

@Component({
  selector: 'app-voice-actor-list',
  templateUrl: './voice-actor-list.component.html',
  styleUrls: ['./voice-actor-list.component.scss'],
  imports: [PersonItemComponent, IonicModule],
})

export class VoiceActorListComponent  implements OnInit {
  @Input() data: Array<VoiceActor> | undefined;

  constructor() { }

  ngOnInit() {
    console.log("voice actors: " + this.data);
  }
}
