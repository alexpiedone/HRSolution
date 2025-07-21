import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';

import { Project, UserProject } from '../../../models/project'; // Verifică path-ul și structura modelelor!
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
  @Input() projects: UserProject[] = [];
  @Input() allAvailableProjects: Project[] = [];

  @Output() projectsUpdated = new EventEmitter<number[]>();
  @Output() newProjectAdded = new EventEmitter<Project>(); // Emitem un eveniment când un proiect nou e creat

  editProjectsForm!: FormGroup;
  isEditingProjects = false;

  showNewProjectModal = false; // Stare pentru vizibilitatea modalului generic
  newProjectFormConfig: FormFieldConfig[] = []; // Configurația câmpurilor pentru proiectul nou

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initProjectsForm();
    this.setupNewProjectFormConfig(); // Setează configurația pentru modalul de proiecte
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projects'] || changes['allAvailableProjects']) {
      this.initProjectsForm();
    }
  }

  initProjectsForm(): void {
    const assignedProjectIds = this.projects.map(p => p.id);
    
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
    return this.allAvailableProjects.find(p => p.id === projectId)?.name || 'Proiect necunoscut';
  }

  // --- Logica pentru modalul generic de adăugare proiect nou ---

  setupNewProjectFormConfig(): void {
    this.newProjectFormConfig = [
      { name: 'name', label: 'Nume Proiect', type: 'text', validators: [Validators.required], placeholder: 'Ex: Proiect Beta' },
      { name: 'description', label: 'Descriere', type: 'textarea', placeholder: 'Detalii despre proiect...' },
      {
        name: 'status', label: 'Status', type: 'selectButton', validators: [Validators.required],
        options: [
          { label: 'Active', value: 'Active' },
          { label: 'Pending', value: 'Pending' }
        ],
        defaultValue: 'Active'
      },
      { name: 'dueDate', label: 'Data Scadenței', type: 'date', validators: [Validators.required], placeholder: 'DD/MM/YYYY' },
      // Poți adăuga aici câmpuri pentru managerId, teamId, etc.,
      // dar pentru moment ne limităm la cele de bază.
      // Dacă vrei dropdown-uri pentru manager/departament,
      // GenericAddEditModal ar trebui să poată prelua entități, sau le poți pasa tu ca 'options'
    ];
  }

  openNewProjectModal(): void {
    this.showNewProjectModal = true;
  }

  onNewProjectDataSaved(formData: any): void {
    const newProject: Project = {
      id: Math.floor(Math.random() * 1000000), // Ex: temporar client-side
      name: formData.name,
      description: formData.description,
      status: formData.status,
      dueDate: formData.dueDate instanceof Date ? formData.dueDate : new Date(formData.dueDate),
    };
    this.newProjectAdded.emit(newProject); // Emite către părinte (UserOverviewComponent)
    this.showNewProjectModal = false; // Închide modalul
  }

  onNewProjectModalClosed(): void {
    this.showNewProjectModal = false;
  }
}