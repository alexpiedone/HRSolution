import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieErrorDialogComponent } from './pie-error-dialog.component';

describe('PieErrorDialogComponent', () => {
  let component: PieErrorDialogComponent;
  let fixture: ComponentFixture<PieErrorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieErrorDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
