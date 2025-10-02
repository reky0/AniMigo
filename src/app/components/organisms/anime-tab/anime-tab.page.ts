import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-anime-tab',
  templateUrl: './anime-tab.page.html',
  styleUrls: ['./anime-tab.page.scss'],
  standalone: true,
  imports: [IonText, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AnimeTabPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
