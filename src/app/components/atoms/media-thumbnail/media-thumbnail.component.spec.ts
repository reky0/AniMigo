import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MediaThumbnailComponent } from './media-thumbnail.component';

describe('MediaThumbnailComponent', () => {
  let component: MediaThumbnailComponent;
  let fixture: ComponentFixture<MediaThumbnailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ MediaThumbnailComponent, IonicModule.forRoot() ]
    }).compileComponents();

    fixture = TestBed.createComponent(MediaThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
