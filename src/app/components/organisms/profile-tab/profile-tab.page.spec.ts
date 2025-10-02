import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileTabPage } from './profile-tab.page';

describe('ProfileTabPage', () => {
  let component: ProfileTabPage;
  let fixture: ComponentFixture<ProfileTabPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
