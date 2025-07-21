import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';

// PrimeNG imports
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown'; // Pentru dropdown-uri generice în modală

// Interfață pentru configurarea câmpurilor formularului
export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'dropdown' | 'selectButton' | 'number';
  validators?: any[]; // Array de validatori (ex: Validators.required)
  options?: { label: string; value: any }[]; // Pentru dropdown sau selectButton
  placeholder?: string;
  defaultValue?: any;
}

@Component({
  selector: 'app-generic-add-edit-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    SelectButtonModule,
    DropdownModule
  ],
  templateUrl: './generic-add-edit-modal.component.html',
  styleUrl: './generic-add-edit-modal.component.css'
})
export class GenericAddEditModalComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() header: string = 'Add/Edit Item';
  @Input() fieldsConfig: FormFieldConfig[] = []; // Configurația dinamică a câmpurilor
  @Input() initialData: any | null = null; // Datele inițiale pentru editare

  @Output() dataSaved = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();

  genericForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible && !this.genericForm) {
      this.initForm();
    }
    // Reinițializează formularul dacă se schimbă configurarea sau datele inițiale
    if ((changes['fieldsConfig'] || changes['initialData']) && this.visible) {
      this.initForm();
    }
  }

  /**
   * Inițializează formularul bazat pe `fieldsConfig` și `initialData`.
   */
  initForm(): void {
    const formGroupConfig: { [key: string]: any } = {};
    this.fieldsConfig.forEach(field => {
      const initialValue = this.initialData?.[field.name] !== undefined ? this.initialData[field.name] : (field.defaultValue || null);
      formGroupConfig[field.name] = [initialValue, field.validators || []];
    });
    this.genericForm = this.fb.group(formGroupConfig);
  }

  /**
   * Când modalul este închis (prin X sau esc).
   */
  onHide(): void {
    this.modalClosed.emit();
    this.genericForm.reset(); // Resetează formularul
    this.visible = false; // Asigură-te că starea internă e actualizată
  }

  /**
   * Salvează datele formularului și le emite.
   */
  saveData(): void {
    if (this.genericForm.valid) {
      this.dataSaved.emit(this.genericForm.value);
      this.onHide(); // Închide modalul
    } else {
      this.genericForm.markAllAsTouched();
    }
  }

  /**
   * Anulează operațiunea și închide modalul.
   */
  cancel(): void {
    this.onHide();
  }

  /**
   * Helper pentru a accesa controlul formularului.
   */
  getControl(name: string): AbstractControl | null {
    return this.genericForm.get(name);
  }
}