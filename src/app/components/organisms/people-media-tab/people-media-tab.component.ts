import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from "@ionic/angular";
import { toSentenceCase } from 'src/app/helpers/utils';
import { Character } from 'src/app/models/aniList/responseInterfaces';

@Component({
  selector: 'app-people-media-tab',
  templateUrl: './people-media-tab.component.html',
  styleUrls: ['./people-media-tab.component.scss'],
  imports: [IonicModule],
})
export class PeopleMediaTabComponent implements OnInit {
  @Input() data: Character | undefined;
  @Output() navigate = new EventEmitter<{id: number, type: string}>(); // Emit changes

  toSentenceCase = toSentenceCase;

  constructor() { }

  ngOnInit() {
    console.log(this.data);
  }

  triggerNavigationEvent(id: number, type: 'ANIME' | 'MANGA') {
    this.navigate.emit({type: type.toLowerCase(), id: id});
  }
}
