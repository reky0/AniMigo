import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PeopleInfoTabComponent } from './people-info-tab.component';

describe('PeopleInfoTabComponent', () => {
  let component: PeopleInfoTabComponent;
  let fixture: ComponentFixture<PeopleInfoTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ PeopleInfoTabComponent, IonicModule.forRoot() ]
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleInfoTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
