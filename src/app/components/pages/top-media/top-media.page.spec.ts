import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopMediaPage } from './top-media.page';

describe('TopMediaPage', () => {
  let component: TopMediaPage;
  let fixture: ComponentFixture<TopMediaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TopMediaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
