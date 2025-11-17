import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserMediaCollectionComponent } from './user-media-collection.component';

describe('UserMediaCollectionComponent', () => {
  let component: UserMediaCollectionComponent;
  let fixture: ComponentFixture<UserMediaCollectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [UserMediaCollectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserMediaCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
