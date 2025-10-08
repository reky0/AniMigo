import { Component, Input, OnInit } from '@angular/core';
import { DetailedMedia } from 'src/app/models/aniList/responseInterfaces';

@Component({
  selector: 'app-relations-tab',
  templateUrl: './relations-tab.component.html',
  styleUrls: ['./relations-tab.component.scss'],
})
export class RelationsTabComponent  implements OnInit {
  @Input() data: DetailedMedia | null | undefined = undefined;

  constructor() { }

  ngOnInit() {}

}
