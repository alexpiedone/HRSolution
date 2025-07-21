import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';

import { Project, UserProject } from '../../../models/project'; 
import { FormFieldConfig, GenericAddEditModalComponent } from '../../../shared/generic-add-edit-modal/generic-add-edit-modal.component';

@Component({
  selector: 'app-user-projects',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    ButtonModule,
    GenericAddEditModalComponent
],
  templateUrl: './user-projects.component.html',
  styleUrl: './user-projects.component.css'
})
export class UserProjectsComponent implements OnInit, OnChanges {
  @Input() userProjects: UserProject[] = [];
  @Input() allAvailableProjects: Project[] = [];

  @Output() projectsUpdated = new EventEmitter<number[]>();
  @Output() newProjectAdded = new EventEmitter<Project>(); 

  editProjectsForm!: FormGroup;
  isEditingProjects = false;

  showNewProjectModal = false;
  newProjectFormConfig: FormFieldConfig[] = [];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initProjectsForm();
    this.setupNewProjectFormConfig();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projects'] || changes['allAvailableProjects']) {
      this.initProjectsForm();
    }
  }

  initProjectsForm(): void {
    const assignedProjectIds = this.userProjects.map(p => p.id);
    
    this.editProjectsForm = this.fb.group({
      selectedProjectToAdd: [null],
      assignedProjects: this.fb.array(assignedProjectIds.map(id => this.fb.control(id)))
    });
  }

  get assignedProjectsArray(): FormArray {
    return this.editProjectsForm.get('assignedProjects') as FormArray;
  }

  enterEditModeProjects(): void {
    this.isEditingProjects = true;
    this.initProjectsForm();
  }

  addProjectFromDropdown(): void {
    const selectedProject: Project = this.editProjectsForm.get('selectedProjectToAdd')?.value;

    if (selectedProject && !this.assignedProjectsArray.controls.some(control => control.value === selectedProject.id)) {
      this.assignedProjectsArray.push(this.fb.control(selectedProject.id));
      this.editProjectsForm.get('selectedProjectToAdd')?.reset();
    }
  }

  removeProject(index: number): void {
    this.assignedProjectsArray.removeAt(index);
  }

  saveProjectsChanges(): void {
    const updatedProjectIds = this.assignedProjectsArray.controls.map(control => control.value);
    this.projectsUpdated.emit(updatedProjectIds);
    this.isEditingProjects = false;
  }

  cancelEditProjects(): void {
    this.isEditingProjects = false;
    this.initProjectsForm();
  }

  getFormControl(formGroup: FormGroup, controlName: string): FormControl {
    const control = formGroup.get(controlName);
    if (control instanceof FormControl) {
      return control;
    }
    throw new Error(`Control '${controlName}' not found or is not a FormControl.`);
  }

  getProjectNameById(projectId: number): string {
    console.log('All available projects:', this.allAvailableProjects);
    return this.allAvailableProjects.find(p => p.id === projectId)?.name || 'Proiect necunoscut';
  }


  setupNewProjectFormConfig(): void {
    this.newProjectFormConfig = [
      { name: 'name', label: 'Nume proiect', type: 'text', validators: [Validators.required], placeholder: 'Ex: Proiect Beta' },
      { name: 'description', label: 'Descriere', type: 'textarea', placeholder: 'Detalii despre proiect...' },
      {
        name: 'status', label: 'Status', type: 'selectButton', validators: [Validators.required],
        options: [
          { label: 'Active', value: 'Active' },
          { label: 'Pending', value: 'Pending' }
        ],
        defaultValue: 'Active'
      },
      { name: 'dueDate', label: 'Data scadentei', type: 'date', validators: [Validators.required], placeholder: 'DD/MM/YYYY' },
    ];
  }

  openNewProjectModal(): void {
    this.showNewProjectModal = true;
  }

  onNewProjectDataSaved(formData: any): void {
    const newProject: Project = {
      id: Math.floor(Math.random() * 1000000), 
      name: formData.name,
      description: formData.description,
      status: formData.status,
      dueDate: formData.dueDate instanceof Date ? formData.dueDate : new Date(formData.dueDate),
    };
    this.newProjectAdded.emit(newProject);
    this.showNewProjectModal = false;
  }

  onNewProjectModalClosed(): void {
    this.showNewProjectModal = false;
  }
}