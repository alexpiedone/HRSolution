import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Salary } from '../../models/salary';
import { Benefit } from '../../models/benefit';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-compensation', 
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './compensation.component.html',
  styleUrls: ['./compensation.component.css']
})
export class CompensationComponent implements OnInit, OnChanges { 
  @Input() currentSalary: Salary | null = null;
  @Input() benefits: Benefit[] = [];
  @Output() benefitsUpdated = new EventEmitter<Benefit[]>();
  @Output() salaryUpdated = new EventEmitter<Salary>(); 

  isEditingBenefits: boolean = false;
  editBenefitsForm!: FormGroup;

  colorStyles: { [key: string]: { bg: string, iconBg: string, text: string } } = {
    'blue': { bg: 'bg-blue-50', iconBg: 'bg-blue-100', text: 'text-blue-500' },
    'green': { bg: 'bg-green-50', iconBg: 'bg-green-100', text: 'text-green-500' },
    'red': { bg: 'bg-red-50', iconBg: 'bg-red-100', text: 'text-red-500' },
    'yellow': { bg: 'bg-yellow-50', iconBg: 'bg-yellow-100', text: 'text-yellow-500' },
    'purple': { bg: 'bg-purple-50', iconBg: 'bg-purple-100', text: 'text-purple-500' },
  };

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initBenefitsForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['benefits']) {
      this.initBenefitsForm();
    }
  }

  initBenefitsForm(): void {
    this.editBenefitsForm = this.fb.group({
      benefitsArray: this.fb.array(this.benefits.map(benefit => this.createBenefitFormGroup(benefit)))
    });
  }

  createBenefitFormGroup(benefit: Benefit): FormGroup {
    return this.fb.group({
      id: [benefit.id],
      name: [benefit.name, Validators.required],
      description: [benefit.description, Validators.required],
      icon: [benefit.icon],
      color: [benefit.color]
    });
  }

  get benefitsArray(): FormArray {
    return this.editBenefitsForm.get('benefitsArray') as FormArray;
  }

  addBenefit(): void {
    this.benefitsArray.push(this.createBenefitFormGroup({ id: 0, name: '', description: '', icon: '', color: '' }));
  }

  removeBenefit(index: number): void {
    this.benefitsArray.removeAt(index);
  }

  enterEditModeBenefits(): void {
    this.isEditingBenefits = true;
    this.initBenefitsForm();
  }

  saveBenefitsChanges(): void {
    if (this.editBenefitsForm.valid) {
      this.benefitsUpdated.emit(this.editBenefitsForm.value.benefitsArray);
      this.isEditingBenefits = false;
    }
  }

  cancelEditBenefits(): void {
    this.isEditingBenefits = false;
    this.initBenefitsForm();
  }

  getFormControl(formGroup: FormGroup, controlName: string): AbstractControl {
    return formGroup.get(controlName)!;
  }

  getStyles(color: string | undefined): { bg: string, iconBg: string, text: string } {
    if (!color || !this.colorStyles[color]) {
      return { bg: 'bg-gray-50', iconBg: 'bg-gray-100', text: 'text-gray-500' };
    }
    return this.colorStyles[color];
  }
}