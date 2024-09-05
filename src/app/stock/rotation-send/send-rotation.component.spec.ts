import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendRotationComponent } from './send-rotation.component';

describe('SendRotationComponent', () => {
  let component: SendRotationComponent;
  let fixture: ComponentFixture<SendRotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendRotationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SendRotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
