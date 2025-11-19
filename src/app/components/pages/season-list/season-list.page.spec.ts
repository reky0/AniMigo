import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeasonListPage } from './season-list.page';

describe('SeasonListPage', () => {
  let component: SeasonListPage;
  let fixture: ComponentFixture<SeasonListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
