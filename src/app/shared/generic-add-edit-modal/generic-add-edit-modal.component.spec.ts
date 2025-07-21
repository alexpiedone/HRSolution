import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericAddEditModalComponent } from './generic-add-edit-modal.component';

describe('GenericAddEditModalComponent', () => {
  let component: GenericAddEditModalComponent;
  let fixture: ComponentFixture<GenericAddEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericAddEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericAddEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
