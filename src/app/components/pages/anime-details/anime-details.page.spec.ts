import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimeDetailsPage } from './anime-details.page';

describe('AnimeDetailsPage', () => {
  let component: AnimeDetailsPage;
  let fixture: ComponentFixture<AnimeDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimeDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
