import { Component, Input, OnInit } from '@angular/core';
import { DetailedMedia } from 'src/app/models/aniList/responseInterfaces';

@Component({
  selector: 'app-characters-tab',
  templateUrl: './characters-tab.component.html',
  styleUrls: ['./characters-tab.component.scss'],
})
export class CharactersTabComponent  implements OnInit {
  @Input() data: DetailedMedia | null | undefined = undefined;

  constructor() { }

  ngOnInit() {}

}
