// src/app/components/user-responsibilities/user-responsibilities.component.ts
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Responsibility } from '../../hr/responsability';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-user-responsibilities',
  imports: [CommonModule, ReactiveFormsModule, DropdownModule, ButtonModule],
  templateUrl: './user-responsibilities.component.html',
  styleUrls: ['./user-responsibilities.component.css']
})
export class UserResponsibilitiesComponent implements OnInit, OnChanges {
  @Input() assignedResponsibilities: Responsibility[] = [];
  @Input() allAvailableResponsibilities: Responsibility[] = [];
  @Output() responsibilitiesUpdated = new EventEmitter<number[]>();

  isEditingResponsibilities: boolean = false;
  editResponsibilitiesForm!: FormGroup;
  initialResponsibilitiesState: number[] = []; // Pentru a anula modificările
  
  // Lista de responsabilități selectate din dropdown care nu sunt încă asignate
  selectedResponsibilityToAdd: Responsibility | null = null;
  availableResponsibilitiesForDropdown: Responsibility[] = [];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['assignedResponsibilities'] || changes['allAvailableResponsibilities']) {
      this.initForm(); // Re-inițializează formularul când se schimbă input-urile
      this.updateAvailableResponsibilitiesForDropdown();
    }
  }

  initForm(): void {
    const assignedIds = this.assignedResponsibilities.map(r => r.id);
    this.initialResponsibilitiesState = [...assignedIds]; // Salvează starea inițială

    this.editResponsibilitiesForm = this.fb.group({
      // Responsabilitățile asignate, reprezentate doar prin ID-uri
      assignedResponsibilitiesArray: this.fb.array(assignedIds.map(id => this.fb.control(id))),
      selectedResponsibilityToAdd: [null] // Control pentru dropdown
    });
    this.updateAvailableResponsibilitiesForDropdown(); // Actualizează lista de dropdown
  }

  get assignedResponsibilitiesArray(): FormArray {
    return this.editResponsibilitiesForm.get('assignedResponsibilitiesArray') as FormArray;
  }

  enterEditModeResponsibilities(): void {
    this.isEditingResponsibilities = true;
    this.initForm(); // Re-inițializează formularul pentru editare
  }

  cancelEditResponsibilities(): void {
    this.isEditingResponsibilities = false;
    this.initForm(); // Revino la starea inițială
  }

  // Metoda pentru a adăuga o responsabilitate nouă din dropdown (existentă)
  addResponsibilityFromDropdown(): void {
    const selectedResp = this.editResponsibilitiesForm.get('selectedResponsibilityToAdd')?.value as Responsibility;

    if (selectedResp && selectedResp.id !== null && selectedResp.id !== undefined) {
      // Verifică dacă nu este deja adăugată
      const isAlreadyAssigned = this.assignedResponsibilitiesArray.controls.some(control => control.value === selectedResp.id);
      
      if (!isAlreadyAssigned) {
        this.assignedResponsibilitiesArray.push(this.fb.control(selectedResp.id));
        this.updateAvailableResponsibilitiesForDropdown(); // Actualizează dropdown-ul după adăugare
      }
    }
    this.editResponsibilitiesForm.get('selectedResponsibilityToAdd')?.reset(); // Golește selecția
  }

  // Metoda pentru a elimina o responsabilitate (din lista celor asignate)
  removeResponsibility(idToRemove: number): void {
    const index = this.assignedResponsibilitiesArray.controls.findIndex(control => control.value === idToRemove);
    if (index !== -1) {
      this.assignedResponsibilitiesArray.removeAt(index);
      this.updateAvailableResponsibilitiesForDropdown(); // Actualizează dropdown-ul după eliminare
    }
  }

  saveResponsibilitiesChanges(): void {
    if (this.editResponsibilitiesForm.valid) {
      const updatedResponsibilityIds = this.assignedResponsibilitiesArray.value as number[];
      this.responsibilitiesUpdated.emit(updatedResponsibilityIds);
      this.isEditingResponsibilities = false;
    }
  }

  // Metodă ajutătoare pentru a obține obiectul Responsibility dintr-un ID
  getResponsibilityById(id: number): Responsibility | undefined {
    return this.allAvailableResponsibilities.find(r => r.id === id);
  }

  // Actualizează lista de responsabilități disponibile pentru dropdown
  updateAvailableResponsibilitiesForDropdown(): void {
    const currentAssignedIds = new Set(this.assignedResponsibilitiesArray.value);
    this.availableResponsibilitiesForDropdown = this.allAvailableResponsibilities
      .filter(r => !currentAssignedIds.has(r.id))
      .sort((a, b) => a.description.localeCompare(b.description)); // Sortează alfabetic
  }

  // Metodă ajutătoare pentru validare
  getFormControl(formGroup: FormGroup, controlName: string): AbstractControl {
    return formGroup.get(controlName)!;
  }
}