import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class PlatformService {
  constructor(private platform: Platform) { }

  isHybrid(): boolean {
    return this.platform.is('hybrid');
  }

  isTouchDevice(): boolean {
    // Prioritize platform-specific checks over browser touch capabilities
    // This prevents desktop browsers with touch emulation from being detected as touch devices
    return this.platform.is('mobile') ||
           this.platform.is('mobileweb') ||
           this.platform.is('tablet') ||
           this.platform.is('ipad') ||
           this.platform.is('android') ||
           this.platform.is('ios') ||
           this.platform.is('hybrid') ||
           (('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth < 992);
  }

  isDesktop(): boolean {
    // Check if screen width is desktop size (>= 992px)
    return window.innerWidth >= 992;
  }

  isTabletOrAbove(): boolean {
    // Check if screen width is tablet or larger (>= 768px)
    return window.innerWidth >= 768;
  }
}
