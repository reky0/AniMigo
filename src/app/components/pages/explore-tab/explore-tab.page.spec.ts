import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExploreTabPage } from './explore-tab.page';

describe('ExploreTabPage', () => {
  let component: ExploreTabPage;
  let fixture: ComponentFixture<ExploreTabPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
