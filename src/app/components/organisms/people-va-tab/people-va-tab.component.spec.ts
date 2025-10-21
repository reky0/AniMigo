import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PeopleVATabComponent } from './people-va-tab.component';

describe('PeopleVATabComponent', () => {
  let component: PeopleVATabComponent;
  let fixture: ComponentFixture<PeopleVATabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ PeopleVATabComponent, IonicModule.forRoot() ]
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleVATabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
