import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceTableComponent } from './race-table.component';

describe('RaceTableComponent', () => {
  let component: RaceTableComponent;
  let fixture: ComponentFixture<RaceTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RaceTableComponent]
    });
    fixture = TestBed.createComponent(RaceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
