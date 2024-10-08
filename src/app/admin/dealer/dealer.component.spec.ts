import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealersComponent } from './dealer.component';

describe('DealersComponent', () => {
  let component: DealersComponent;
  let fixture: ComponentFixture<DealersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DealersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
