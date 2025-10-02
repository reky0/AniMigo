import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-explore-tab',
  templateUrl: './explore-tab.page.html',
  styleUrls: ['./explore-tab.page.scss'],
  standalone: true,
  imports: [IonText, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ExploreTabPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
