import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MediaListPage } from './media-list.page';

describe('MediaListPage', () => {
  let component: MediaListPage;
  let fixture: ComponentFixture<MediaListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
