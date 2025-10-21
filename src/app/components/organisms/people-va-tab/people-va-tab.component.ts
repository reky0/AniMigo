import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-people-va-tab',
  templateUrl: './people-va-tab.component.html',
  styleUrls: ['./people-va-tab.component.scss'],
})
export class PeopleVATabComponent  implements OnInit {
  @Input() data: any;
  @Input() loading: boolean = true;

  constructor() { }

  ngOnInit() {}

}
