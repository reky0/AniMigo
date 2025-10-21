import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MediaListItemComponent } from './media-list-item.component';

describe('MediaListItemComponent', () => {
  let component: MediaListItemComponent;
  let fixture: ComponentFixture<MediaListItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MediaListItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MediaListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
