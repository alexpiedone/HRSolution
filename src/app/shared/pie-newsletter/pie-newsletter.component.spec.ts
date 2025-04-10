import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieNewsletterComponent } from './pie-newsletter.component';

describe('PieNewsletterComponent', () => {
  let component: PieNewsletterComponent;
  let fixture: ComponentFixture<PieNewsletterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieNewsletterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieNewsletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
