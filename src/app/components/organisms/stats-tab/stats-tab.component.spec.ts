import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StatsTabComponent } from './stats-tab.component';

describe('StatsTabComponent', () => {
  let component: StatsTabComponent;
  let fixture: ComponentFixture<StatsTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ StatsTabComponent, IonicModule.forRoot() ]
    }).compileComponents();

    fixture = TestBed.createComponent(StatsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
