import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PeopleMediaTabComponent } from './people-media-tab.component';

describe('PeopleMediaTabComponent', () => {
  let component: PeopleMediaTabComponent;
  let fixture: ComponentFixture<PeopleMediaTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ PeopleMediaTabComponent, IonicModule.forRoot() ]
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleMediaTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
