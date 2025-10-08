import { Component, ElementRef, ViewChild, AfterViewInit, input, signal, Input } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDown, chevronDownOutline, chevronUp, chevronUpOutline } from 'ionicons/icons';

@Component({
  selector: 'app-collapsible',
  standalone: true,
  templateUrl: './collapsible.component.html',
  styleUrls: ['./collapsible.component.scss'],
  imports: [IonButton, IonIcon]
})
export class CollapsibleComponent implements AfterViewInit {
  @ViewChild('content') contentElement!: ElementRef;
  @ViewChild('contentWrapper') contentWrapper!: ElementRef;

  // Input for threshold height in pixels (default 200px)
  @Input() thresholdHeight: number = 200;

  // Signals for reactive state
  isCollapsed = signal(true);
  shouldCollapse = signal(false);
  private contentHeight = signal(0);

  constructor() {
    // Register icons
    addIcons({ chevronDown, chevronUp });
  }

  ngAfterViewInit() {
    // Check content height after view initializes
    setTimeout(() => {
      this.checkContentHeight();
    }, 0);
  }

  private checkContentHeight() {
    if (this.contentElement) {
      const height = this.contentElement.nativeElement.scrollHeight;
      this.contentHeight.set(height);
      this.shouldCollapse.set(height > this.thresholdHeight);
    }
  }

  toggleCollapse() {
    this.isCollapsed.update(v => !v);
  }

  getMaxHeight(): string {
    if (!this.shouldCollapse()) {
      return 'none';
    }
    // Use a very large max-height for smooth animation without height calculation issues
    return this.isCollapsed()
      ? `${this.thresholdHeight}px`
      : '9999px';
  }
}
