import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  template: '',
  styleUrls: [],
  standalone: true,
})
export class LoadingStateComponent {
  @Input() loading: boolean = false;
}
