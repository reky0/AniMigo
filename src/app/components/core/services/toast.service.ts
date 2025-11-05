import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, inject, Injectable } from '@angular/core';
import { ToastComponent } from '@components/atoms/toast/toast.component';

/**
 * Toast Service - Component-based toast notifications
 *
 * Uses a custom toast component rendered directly in the DOM for guaranteed visibility.
 * This approach bypasses Ionic controller issues by rendering toasts
 * as regular Angular components in the application root.
 *
 * Benefits:
 * - Always visible (renders in main DOM)
 * - No controller dependencies
 * - Works in production builds
 * - Reliable across all platforms
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastComponentRef: ComponentRef<ToastComponent> | null = null;
  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);

  constructor() {
    this.initializeToastComponent();
  }

  private initializeToastComponent(): void {
    // Create the toast component dynamically
    this.toastComponentRef = createComponent(ToastComponent, {
      environmentInjector: this.injector
    });

    // Attach to application
    this.appRef.attachView(this.toastComponentRef.hostView);

    // Add to DOM
    const domElem = (this.toastComponentRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);
  }

  private getToastComponent(): ToastComponent | null {
    return this.toastComponentRef?.instance || null;
  }

  /**
   * Set tab bar visibility to adjust toast positioning
   * @param visible - Whether the tab bar is visible on the current page
   */
  setTabBarVisibility(visible: boolean): void {
    const component = this.getToastComponent();
    if (component) {
      component.setTabBarVisibility(visible);
    }
  }

  /**
   * Show a success toast
   * @param message - The message to display
   */
  async success(message: string): Promise<void> {
    const component = this.getToastComponent();
    if (component) {
      component.show({
        type: 'success',
        message,
        duration: 3000
      });
    }
  }

  /**
   * Show an error toast
   * @param message - The message to display
   */
  async error(message: string): Promise<void> {
    const component = this.getToastComponent();
    if (component) {
      component.show({
        type: 'error',
        message,
        duration: 4000
      });
    }
  }


}
