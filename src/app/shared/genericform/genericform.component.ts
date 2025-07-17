import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  TemplateRef
} from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

export type FieldType =
  | 'text' | 'email' | 'tel' | 'date' | 'number'
  | 'select' | 'textarea' | 'checkbox' | 'radio' | 'file';

export interface FieldOption {
  label: string;
  value: any;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  editable: boolean;
  validators?: any[];
  options?: FieldOption[];
  multiple?: boolean;
  placeholder?: string;
  cols?: number;
  customTemplate?: TemplateRef<any>;
}

@Component({
  selector: 'app-generic-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './genericform.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericFormComponent implements OnChanges {
  @Input() model!: any;
  @Input() fields: FieldConfig[] = [];
  @Input() saveEndpoint!: string;
  @Output() saved = new EventEmitter<any>();

  form!: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fields'] || changes['model']) {
      this.buildForm();
    }
  }

  private buildForm() {
    const group: Record<string, any> = {};
    this.fields.forEach(f => {
      group[f.name] = [
        { value: this.model?.[f.name] ?? '', disabled: !f.editable },
        f.validators || []
      ];
    });
    this.form = this.fb.group(group);
  }

  onSave() {
    if (this.form.invalid) return;
    const payload = this.form.getRawValue();
    this.saved.emit({ endpoint: this.saveEndpoint, payload });
  }

  hasError(name: string, error: string) {
    const ctrl = this.form.get(name);
    return ctrl?.touched && ctrl.hasError(error);
  }
}
