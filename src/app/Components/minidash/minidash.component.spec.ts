import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinidashComponent } from './minidash.component';

describe('MinidashComponent', () => {
  let component: MinidashComponent;
  let fixture: ComponentFixture<MinidashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinidashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinidashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
