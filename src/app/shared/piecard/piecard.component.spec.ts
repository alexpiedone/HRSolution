import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiecardComponent } from './piecard.component';

describe('PiecardComponent', () => {
  let component: PiecardComponent;
  let fixture: ComponentFixture<PiecardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PiecardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PiecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
