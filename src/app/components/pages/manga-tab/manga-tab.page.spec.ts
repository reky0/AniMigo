import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MangaTabPage } from './manga-tab.page';

describe('MangaTabPage', () => {
  let component: MangaTabPage;
  let fixture: ComponentFixture<MangaTabPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MangaTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
