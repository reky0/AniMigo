import { Component, Input, OnInit } from '@angular/core';
import { DetailedMedia } from 'src/app/models/aniList/responseInterfaces';

@Component({
  selector: 'app-stats-tab',
  templateUrl: './stats-tab.component.html',
  styleUrls: ['./stats-tab.component.scss'],
})
export class StatsTabComponent  implements OnInit {
  @Input() data: DetailedMedia | null | undefined = undefined;

  constructor() { }

  ngOnInit() {}

}
