import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PlatformService } from '@components/core/services/platform.service';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, close, closeCircle, informationCircle, warning } from 'ionicons/icons';

export interface ToastData {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface ToastItem extends ToastData {
  id: number;
}

@Component({
  selector: 'am-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonButton]
})
export class ToastComponent {
  toasts: Array<ToastItem> = [];
  private idCounter = 0;
  isTabBarVisible: boolean = true;

  constructor(
    readonly platformService: PlatformService
  ) {
    addIcons({ checkmarkCircle, closeCircle, informationCircle, warning, close });
  }

  get isTabBarOnTop(): boolean {
    return !this.platformService.isHybrid();
  }

  setTabBarVisibility(visible: boolean): void {
    this.isTabBarVisible = visible;
  }

  show(data: ToastData): void {
    const id = this.idCounter++;
    const toast: ToastItem = { ...data, id };

    this.toasts.push(toast);

    // Auto dismiss
    const duration = data.duration || (data.type === 'error' ? 4000 : 3000);
    setTimeout(() => {
      this.dismiss(id);
    }, duration);
  }

  dismiss(id: number): void {
    const index = this.toasts.findIndex(t => t.id === id);
    if (index !== -1) {
      this.toasts.splice(index, 1);
    }
  }

  getIcon(type: string): string {
    const icons = {
      success: 'checkmark-circle',
      error: 'close-circle',
      warning: 'warning',
      info: 'information-circle'
    };
    return icons[type as keyof typeof icons] || 'information-circle';
  }
}
