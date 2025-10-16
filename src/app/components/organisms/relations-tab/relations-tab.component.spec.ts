import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RelationsTabComponent } from './relations-tab.component';

describe('RelationsTabComponent', () => {
  let component: RelationsTabComponent;
  let fixture: ComponentFixture<RelationsTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ RelationsTabComponent, IonicModule.forRoot() ]
    }).compileComponents();

    fixture = TestBed.createComponent(RelationsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
