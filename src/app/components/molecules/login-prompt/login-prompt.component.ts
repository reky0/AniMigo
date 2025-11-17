import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardTitle,
  IonIcon,
  IonImg,
  IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logInOutline } from 'ionicons/icons';

@Component({
  selector: 'am-login-prompt',
  templateUrl: './login-prompt.component.html',
  styleUrls: ['./login-prompt.component.scss'],
  standalone: true,
  imports: [
    IonCard,
    IonCardTitle,
    IonImg,
    IonText,
    IonButton,
    IonIcon
  ]
})
export class LoginPromptComponent {
  @Input() title: string = 'Not logged in yet?';
  @Input() message: string = 'Worry not! Here you go, press this button to link your AniList account.';
  @Input() buttonText: string = 'Log in with AniList';
  @Input() showImage: boolean = true;
  @Input() imageSrc: string = 'assets/images/megamind-sad.jpg';
  @Input() imageAlt: string = 'Login with AniList';

  @Output() loginClick = new EventEmitter<void>();

  constructor() {
    addIcons({ logInOutline });
  }

  onLoginClick() {
    this.loginClick.emit();
  }
}
