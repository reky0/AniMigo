import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Top100Page } from './top-100.page';

describe('Top100Page', () => {
  let component: Top100Page;
  let fixture: ComponentFixture<Top100Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Top100Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
