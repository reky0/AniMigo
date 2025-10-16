import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MetaItemComponent } from './meta-item.component';

describe('MetaItemComponent', () => {
  let component: MetaItemComponent;
  let fixture: ComponentFixture<MetaItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ MetaItemComponent, IonicModule.forRoot() ]
    }).compileComponents();

    fixture = TestBed.createComponent(MetaItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
