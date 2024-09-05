import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RotationDetailComponent } from './rotation-detail.component';

describe('RotationDetailComponent', () => {
  let component: RotationDetailComponent;
  let fixture: ComponentFixture<RotationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RotationDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RotationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
