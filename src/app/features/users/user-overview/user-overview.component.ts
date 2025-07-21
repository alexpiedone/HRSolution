import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { UpdateRoleDto, User, UserProfileUpdateDTO, UserRoleInfo } from '../../../models/user';
import { AuthService } from '../../auth/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { GenericDropdownComponent } from '../../../shared/generic-drop-down/generic-drop-down.component';
import { forkJoin, finalize, take } from 'rxjs';
import { Project, UserProject } from '../../../models/project';
import { Benefit } from '../../../models/benefit';
import { Document } from '../../../models/document';
import { Role } from '../../../models/role';
import { Salary } from '../../../models/salary';
import { Responsibility } from '../../hr/responsability';
import { UserProfileComponent } from "../user-profile/user-profile.component";
import { UserRoleInfoComponent } from "../user-role-info/user-role-info.component";

@Component({
  selector: 'app-user-overview',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, GenericDropdownComponent, UserProfileComponent, UserRoleInfoComponent],
  templateUrl: './user-overview.component.html',
  styleUrl: './user-overview.component.css'
})
export class UserOverviewComponent implements OnInit {

  activeTab: string = 'personal-info';
  userinfo: User | undefined = undefined;
  userRoleinfo: UserRoleInfo | undefined = undefined;

  isEditingProjects = false;
  isEditingResponsibilities = false;
  isEditingBenefits = false;

  editProjectsForm: FormGroup;
  editResponsibilitiesForm: FormGroup;
  editBenefitsForm: FormGroup;

  allAvailableProjects: Project[] = [];
  projects: UserProject[] = [];
  responsibilities: Responsibility[] = [];
  currentSalary: Salary | null = null;
  benefits: Benefit[] = [];
  documents: Document[] = [];
  roles: Role[] = [];

  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {


    this.editProjectsForm = this.fb.group({
      selectedProjectToAdd: [null], 
      assignedProjects: this.fb.array([]) 
    });

    this.editResponsibilitiesForm = this.fb.group({
      responsibilitiesArray: this.fb.array([])
    });

    this.editBenefitsForm = this.fb.group({
      benefitsArray: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    const userId = this.authService.getCurrentUserId();

    if (userId !== null) {
      forkJoin({
        userInfo: this.userService.getUserInfo(userId),
        userRoleInfo: this.userService.getUserRoleInfo(userId),
        userResponsibilities: this.userService.getUserResponsibilities(userId),
        userProjects: this.userService.getUserProjects(userId),
        userBenefits: this.userService.getUserBenefits(userId),
        userDocuments: this.userService.getUserDocuments(userId),
        userCurrentSalary: this.userService.getUserCurrentSalary(userId),
        allProjects: this.userService.getAllProjects()
      }).pipe(
        take(1),
        finalize(() => { })
      ).subscribe({
        next: ({ userInfo, userRoleInfo, userResponsibilities, userProjects, userBenefits, userDocuments, userCurrentSalary, allProjects }) => {
          this.userinfo = userInfo;
          this.userRoleinfo = userRoleInfo;
          this.responsibilities = userResponsibilities;
          this.projects = userProjects;
          this.benefits = userBenefits;
          this.documents = userDocuments;
          this.currentSalary = userCurrentSalary;
          this.allAvailableProjects = allProjects;

          this.populateForms();
        },
        error: (error) => {
          this.notificationService.showError('Eroare la încărcarea datelor utilizatorului!');
          console.error('Error loading user data:', error);
        }
      });
    }
  }

  private populateForms(): void {
    this.setAssignedProjectsFormArray(this.projects);
    this.setResponsibilitiesFormArray(this.responsibilities);
    this.setBenefitsFormArray(this.benefits);
  }


  getFormControl(formGroup: FormGroup, controlName: string): FormControl {
    const control = formGroup.get(controlName);
    if (control instanceof FormControl) {
      return control;
    }
    throw new Error(`Control '${controlName}' not found or is not a FormControl in the provided FormGroup.`);
  }

  //#region Proiecte
  get assignedProjectsArray(): FormArray {
    return this.editProjectsForm.get('assignedProjects') as FormArray;
  }

  private createAssignedProjectFormControl(projectId: number): FormControl {
    return this.fb.control(projectId, Validators.required);
  }

  private setAssignedProjectsFormArray(projects: UserProject[]): void {
    this.assignedProjectsArray.clear();
    projects.forEach(project => this.assignedProjectsArray.push(this.createAssignedProjectFormControl(project.id)));
  }

  enterEditModeProjects(): void {
    this.isEditingProjects = true;
    this.setAssignedProjectsFormArray(this.projects); // Reîncarcă ID-urile proiectelor curente
    this.editProjectsForm.get('selectedProjectToAdd')?.reset(); // Resetează dropdown-ul de selecție
  }

  addProjectFromDropdown(): void {
    const selectedProjectId = this.editProjectsForm.get('selectedProjectToAdd')?.value;
    if (selectedProjectId && !this.assignedProjectsArray.controls.some(control => control.value === selectedProjectId)) {
      this.assignedProjectsArray.push(this.createAssignedProjectFormControl(selectedProjectId));
      this.editProjectsForm.get('selectedProjectToAdd')?.reset(); // Resetează după adăugare
      this.notificationService.showSuccess('Proiect adăugat în lista de editare! Salvează pentru a aplica.');
    } else if (selectedProjectId) {
      this.notificationService.showInfo('Acest proiect este deja asignat.');
    } else {
      this.notificationService.showError('Vă rugăm să selectați un proiect.');
    }
  }

  removeProject(index: number): void {
    this.assignedProjectsArray.removeAt(index);
    this.notificationService.showInfo('Proiect eliminat din lista de editare. Salvează pentru a aplica.');
  }

  cancelEditProjects(): void {
    this.isEditingProjects = false;
    this.setAssignedProjectsFormArray(this.projects); // Resetează la valorile originale
    this.editProjectsForm.get('selectedProjectToAdd')?.reset();
  }

  saveProjectsChanges(): void {
    if (this.assignedProjectsArray.valid) { // Validăm doar FormArray-ul de proiecte asignate
      const updatedProjectIds: number[] = this.assignedProjectsArray.value;
      const userId = this.authService.getCurrentUserId();

      if (userId) {
        // Aici trimitem doar lista de ID-uri de proiecte
        this.userService.updateUserAssignedProjects(userId, updatedProjectIds).subscribe({
          next: () => {
            this.notificationService.showSuccess('Proiecte asignate actualizate cu succes! 🚀');
            // Reîmprospătăm lista de proiecte a utilizatorului apelând din nou API-ul sau construind-o local
            // Este mai sigur să reîncarci de la server dacă vrei detalii complete
            this.loadUserData(); // Reîncarcă toate datele, inclusiv proiectele cu detalii complete
            this.isEditingProjects = false;
          },
          error: (error) => {
            this.notificationService.showError('Eroare la actualizarea proiectelor asignate!');
            console.error('Error updating user assigned projects:', error);
          }
        });
      }
    } else {
      this.notificationService.showError('Vă rugăm să completați toate câmpurile obligatorii pentru proiecte asignate!');
      this.editProjectsForm.markAllAsTouched();
    }
  }

  //#endregion

  //#region Responsabilități

  get responsibilitiesArray(): FormArray {
    return this.editResponsibilitiesForm.get('responsibilitiesArray') as FormArray;
  }

  private createResponsibilityFormGroup(responsibility: Responsibility | null = null): FormGroup {
    return this.fb.group({
      id: [responsibility?.id || 0],
      description: [responsibility?.description || '', Validators.required]
    });
  }

  private setResponsibilitiesFormArray(responsibilities: Responsibility[]): void {
    this.responsibilitiesArray.clear();
    responsibilities.forEach(resp => this.responsibilitiesArray.push(this.createResponsibilityFormGroup(resp)));
  }

  enterEditModeResponsibilities(): void {
    this.isEditingResponsibilities = true;
    this.setResponsibilitiesFormArray(this.responsibilities);
  }

  addResponsibility(): void {
    this.responsibilitiesArray.push(this.createResponsibilityFormGroup());
  }

  removeResponsibility(index: number): void {
    this.responsibilitiesArray.removeAt(index);
  }

  cancelEditResponsibilities(): void {
    this.isEditingResponsibilities = false;
    this.setResponsibilitiesFormArray(this.responsibilities);
  }

  saveResponsibilitiesChanges(): void {
    if (this.editResponsibilitiesForm.valid) {
      const updatedResponsibilities: Responsibility[] = this.responsibilitiesArray.value;
      const userId = this.authService.getCurrentUserId();

      if (userId) {
        this.userService.updateUserResponsibilities(userId, updatedResponsibilities).subscribe({
          next: () => {
            this.notificationService.showSuccess('Responsabilități actualizate cu succes! ✅');
            this.responsibilities = updatedResponsibilities;
            this.isEditingResponsibilities = false;
          },
          error: (error) => {
            this.notificationService.showError('Eroare la actualizarea responsabilităților!');
            console.error('Error updating user responsibilities:', error);
          }
        });
      }
    } else {
      this.notificationService.showError('Vă rugăm să completați toate câmpurile obligatorii pentru responsabilități!');
      this.editResponsibilitiesForm.markAllAsTouched();
    }
  }
  //#endregion
  
  //#region Beneficii
  get benefitsArray(): FormArray {
    return this.editBenefitsForm.get('benefitsArray') as FormArray;
  }

  private createBenefitFormGroup(benefit: Benefit | null = null): FormGroup {
    return this.fb.group({
      id: [benefit?.id || 0],
      name: [benefit?.name || '', Validators.required],
      description: [benefit?.description || '', Validators.required],
      icon: [benefit?.icon || 'circle'], // Icon implicit
      color: [benefit?.color || 'blue'] // Culoare implicită
    });
  }

  private setBenefitsFormArray(benefits: Benefit[]): void {
    this.benefitsArray.clear();
    benefits.forEach(benefit => this.benefitsArray.push(this.createBenefitFormGroup(benefit)));
  }

  enterEditModeBenefits(): void {
    this.isEditingBenefits = true;
    this.setBenefitsFormArray(this.benefits);
  }

  addBenefit(): void {
    this.benefitsArray.push(this.createBenefitFormGroup());
  }

  removeBenefit(index: number): void {
    this.benefitsArray.removeAt(index);
  }

  cancelEditBenefits(): void {
    this.isEditingBenefits = false;
    this.setBenefitsFormArray(this.benefits);
  }

  saveBenefitsChanges(): void {
    if (this.editBenefitsForm.valid) {
      const updatedBenefits: Benefit[] = this.benefitsArray.value;
      const userId = this.authService.getCurrentUserId();

      if (userId) {
        this.userService.updateUserBenefits(userId, updatedBenefits).subscribe({
          next: () => {
            this.notificationService.showSuccess('Beneficii actualizate cu succes! 🎁');
            this.benefits = updatedBenefits;
            this.isEditingBenefits = false;
          },
          error: (error) => {
            this.notificationService.showError('Eroare la actualizarea beneficiilor!');
            console.error('Error updating user benefits:', error);
          }
        });
      }
    } else {
      this.notificationService.showError('Vă rugăm să completați toate câmpurile obligatorii pentru beneficii!');
      this.editBenefitsForm.markAllAsTouched();
    }
  }
  //#endregion
  

  onProfileUpdated(updatedProfile: UserProfileUpdateDTO): void {
    const userId = this.authService.getCurrentUserId();

    if (userId) {
      this.userService.updateUserInfo(userId, updatedProfile).subscribe({
        next: () => {
          this.notificationService.showSuccess('Profil actualizat cu succes! 🥳');
          this.userinfo = { ...this.userinfo, ...updatedProfile } as User; 
        },
        error: (error) => {
          this.notificationService.showError('Eroare la actualizarea profilului!');
          console.error('Error updating user info:', error);
        }
      });
    } else {
      this.notificationService.showError('ID utilizator invalid. Nu se poate actualiza profilul.');
    }
  }

  onRoleInfoUpdated(updatedRole: UpdateRoleDto): void {
    const userId = this.authService.getCurrentUserId();

    if (userId) {
      this.userService.updateUserRoleInfo(userId, updatedRole).subscribe({
        next: () => {
          this.notificationService.showSuccess('Informațiile rolului au fost actualizate cu succes! 🎉');
          this.loadUserData();
        },
        error: (error) => {
          this.notificationService.showError('Eroare la actualizarea informațiilor rolului!');
          console.error('Error updating user role info:', error);
        }
      });
    } else {
      this.notificationService.showError('ID utilizator invalid. Nu se poate actualiza rolul.');
    }
  }

  changeTab(tabId: string): void {
    this.activeTab = tabId;
  }

  downloadDocument(documentName: string): void {
    console.log(`Downloading ${documentName}`);
  }

  getStyles(color?: string): { bg: string; iconBg: string; text: string } {
    const c = color ?? 'blue';
    return {
      bg: `bg-${c}-50`,
      iconBg: `bg-${c}-200`,
      text: `text-${c}-400`
    };
  }

  getProjectNameById(projectId: number): string {
    const project = this.allAvailableProjects.find(p => p.id === projectId);
    return project ? project.name : 'Proiect necunoscut';
  }

  getProjectDetailsById(projectId: number): UserProject | undefined {
    return this.projects.find(p => p.id === projectId);
  }

  salaryHistory = [
    { date: 'March 20, 2023', amount: '$5,800.00', change: '+7.4%', changeClass: 'badge-success', reason: 'Annual Review' },
    { date: 'November 10, 2022', amount: '$5,400.00', change: '+12.5%', changeClass: 'badge-success', reason: 'Promotion' },
    { date: 'March 15, 2022', amount: '$4,800.00', change: '+6.7%', changeClass: 'badge-success', reason: 'Annual Review' },
    { date: 'March 15, 2021', amount: '$4,500.00', change: 'Initial', changeClass: 'badge-info', reason: 'Hiring' }
  ];

  hierarchy = {
    manager: {
      name: 'Michael Chen',
      role: 'Engineering Manager',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    currentEmployee: {
      name: 'Sarah Johnson',
      role: 'Frontend Developer',
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    teamMembers: [
      { name: 'David Kim', role: 'Frontend Developer', image: 'https://randomuser.me/api/portraits/men/22.jpg' },
      { name: 'Emily Rodriguez', role: 'UI/UX Designer', image: 'https://randomuser.me/api/portraits/women/28.jpg' },
      { name: 'James Wilson', role: 'Backend Developer', image: 'https://randomuser.me/api/portraits/men/36.jpg' },
      { name: 'Sophia Lee', role: 'QA Engineer', image: 'https://randomuser.me/api/portraits/women/56.jpg' }
    ]
  };
}