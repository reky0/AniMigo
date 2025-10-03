import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MangaDetailsPage } from './manga-details.page';

describe('MangaDetailsPage', () => {
  let component: MangaDetailsPage;
  let fixture: ComponentFixture<MangaDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MangaDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
