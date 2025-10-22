import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopPopularPage } from './top-popular.page';

describe('TopPopularPage', () => {
  let component: TopPopularPage;
  let fixture: ComponentFixture<TopPopularPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TopPopularPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
