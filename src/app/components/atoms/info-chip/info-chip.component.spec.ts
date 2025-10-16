import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfoChipComponent } from './info-chip.component';

describe('InfoChipComponent', () => {
  let component: InfoChipComponent;
  let fixture: ComponentFixture<InfoChipComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ InfoChipComponent, IonicModule.forRoot() ]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
