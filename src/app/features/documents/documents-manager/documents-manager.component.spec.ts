import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsManagerComponent } from './documents-manager.component';

describe('DocumentsManagerComponent', () => {
  let component: DocumentsManagerComponent;
  let fixture: ComponentFixture<DocumentsManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
