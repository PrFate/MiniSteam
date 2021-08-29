import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnDeclineAcceptComponent } from './btn-decline-accept.component';

describe('BtnDeclineAcceptComponent', () => {
  let component: BtnDeclineAcceptComponent;
  let fixture: ComponentFixture<BtnDeclineAcceptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtnDeclineAcceptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnDeclineAcceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
