import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";

@Component({
  selector: 'app-chart-bar',
  templateUrl: './chart-bar.component.html',
  styleUrls: ['./chart-bar.component.scss'],
  imports: [IonicModule],
})
export class ChartBarComponent implements OnInit {
  @Input() legend: string | undefined;
  @Input() color: string | undefined;
  @Input() value: number = -1;
  @Input() highest: number = -1;

  showValueUsed = false;
  @Input()
  set showValue(value: any) {
    this.showValueUsed = value !== null && value !== undefined;
  }

  constructor() { }

  ngOnInit() {
    // console.log(this.legend);
  }

}
