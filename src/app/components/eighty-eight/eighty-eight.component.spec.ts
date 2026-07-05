import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EightyEightComponent } from './eighty-eight.component';

describe('EightyEightComponent', () => {
  let component: EightyEightComponent;
  let fixture: ComponentFixture<EightyEightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EightyEightComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EightyEightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
