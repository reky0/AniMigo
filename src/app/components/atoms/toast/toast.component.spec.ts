import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent } from './toast.component';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty toasts array', () => {
    expect(component.toasts).toEqual([]);
  });

  describe('show()', () => {
    it('should add a toast to the list', () => {
      const toastData = {
        type: 'success' as const,
        message: 'Test success message'
      };

      component.show(toastData);

      expect(component.toasts.length).toBe(1);
      expect(component.toasts[0].message).toBe('Test success message');
      expect(component.toasts[0].type).toBe('success');
    });

    it('should assign unique IDs to toasts', () => {
      component.show({ type: 'success', message: 'First' });
      component.show({ type: 'error', message: 'Second' });

      expect(component.toasts[0].id).toBe(0);
      expect(component.toasts[1].id).toBe(1);
    });

    it('should use default duration for non-error toasts', (done) => {
      jasmine.clock().install();

      component.show({ type: 'success', message: 'Test' });

      expect(component.toasts.length).toBe(1);

      jasmine.clock().tick(3000);

      expect(component.toasts.length).toBe(0);

      jasmine.clock().uninstall();
      done();
    });

    it('should use longer duration for error toasts', (done) => {
      jasmine.clock().install();

      component.show({ type: 'error', message: 'Test error' });

      expect(component.toasts.length).toBe(1);

      // Should still be visible after 3 seconds
      jasmine.clock().tick(3000);
      expect(component.toasts.length).toBe(1);

      // Should be dismissed after 4 seconds
      jasmine.clock().tick(1000);
      expect(component.toasts.length).toBe(0);

      jasmine.clock().uninstall();
      done();
    });

    it('should respect custom duration', (done) => {
      jasmine.clock().install();

      component.show({
        type: 'info',
        message: 'Test',
        duration: 5000
      });

      expect(component.toasts.length).toBe(1);

      jasmine.clock().tick(5000);
      expect(component.toasts.length).toBe(0);

      jasmine.clock().uninstall();
      done();
    });
  });

  describe('dismiss()', () => {
    it('should remove toast by ID', () => {
      component.show({ type: 'success', message: 'First' });
      component.show({ type: 'error', message: 'Second' });

      const firstId = component.toasts[0].id;

      component.dismiss(firstId);

      expect(component.toasts.length).toBe(1);
      expect(component.toasts[0].message).toBe('Second');
    });

    it('should handle dismissing non-existent ID gracefully', () => {
      component.show({ type: 'success', message: 'Test' });

      expect(() => component.dismiss(999)).not.toThrow();
      expect(component.toasts.length).toBe(1);
    });
  });

  describe('getIcon()', () => {
    it('should return correct icon for success', () => {
      expect(component.getIcon('success')).toBe('checkmark-circle');
    });

    it('should return correct icon for error', () => {
      expect(component.getIcon('error')).toBe('close-circle');
    });

    it('should return correct icon for warning', () => {
      expect(component.getIcon('warning')).toBe('warning');
    });

    it('should return correct icon for info', () => {
      expect(component.getIcon('info')).toBe('information-circle');
    });

    it('should return default icon for unknown type', () => {
      expect(component.getIcon('unknown')).toBe('information-circle');
    });
  });

  describe('multiple toasts', () => {
    it('should handle multiple toasts simultaneously', () => {
      component.show({ type: 'success', message: 'First' });
      component.show({ type: 'error', message: 'Second' });
      component.show({ type: 'warning', message: 'Third' });

      expect(component.toasts.length).toBe(3);
    });

    it('should maintain order of toasts', () => {
      component.show({ type: 'success', message: 'First' });
      component.show({ type: 'error', message: 'Second' });

      expect(component.toasts[0].message).toBe('First');
      expect(component.toasts[1].message).toBe('Second');
    });
  });
});
