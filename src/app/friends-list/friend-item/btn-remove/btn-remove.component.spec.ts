import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnRemoveComponent } from './btn-remove.component';

describe('BtnRemoveComponent', () => {
  let component: BtnRemoveComponent;
  let fixture: ComponentFixture<BtnRemoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtnRemoveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
