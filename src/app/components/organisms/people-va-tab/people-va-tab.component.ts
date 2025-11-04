import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-people-va-tab',
  templateUrl: './people-va-tab.component.html',
  styleUrls: ['./people-va-tab.component.scss'],
})
export class PeopleVATabComponent {
  @Input() data: any;
  @Input() loading: boolean = true;

  constructor() { }
}
