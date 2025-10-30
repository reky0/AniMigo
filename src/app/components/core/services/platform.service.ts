import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular'

@Injectable({
  providedIn: 'root'
})

export class PlatformService {
  constructor(private platform: Platform) { }

  isHybrid(): boolean {
    return this.platform.is('hybrid');
  }

  isTouchDevice(): boolean {
    return ('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0) ||
           this.platform.is('mobile') ||
           this.platform.is('mobileweb') ||
           this.platform.is('hybrid');
  }
}
