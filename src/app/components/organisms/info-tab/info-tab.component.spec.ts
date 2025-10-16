import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfoTabComponent } from './info-tab.component';

describe('InfoTabComponent', () => {
  let component: InfoTabComponent;
  let fixture: ComponentFixture<InfoTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ InfoTabComponent, IonicModule.forRoot() ]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
