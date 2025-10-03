import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimeTabPage } from './anime-tab.page';

describe('AnimeTabPage', () => {
  let component: AnimeTabPage;
  let fixture: ComponentFixture<AnimeTabPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimeTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
