import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ApolloTestingModule } from 'apollo-angular/testing';

import { PeopleTabComponent } from './people-tab.component';

describe('CharactersTabComponent', () => {
  let component: PeopleTabComponent;
  let fixture: ComponentFixture<PeopleTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ PeopleTabComponent, IonicModule.forRoot(), ApolloTestingModule ]
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
