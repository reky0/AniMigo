import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CoverImageComponent } from './cover-image.component';

describe('CoverImageComponent', () => {
  let component: CoverImageComponent;
  let fixture: ComponentFixture<CoverImageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ CoverImageComponent, IonicModule.forRoot() ]
    }).compileComponents();

    fixture = TestBed.createComponent(CoverImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
