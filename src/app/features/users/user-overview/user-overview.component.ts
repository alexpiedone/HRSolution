import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { UpdateRoleDto, User, UserProfileUpdateDTO, UserRoleInfo } from '../../../models/user';
import { AuthService } from '../../auth/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { forkJoin, finalize, take } from 'rxjs';
import { Project, UserProject } from '../../../models/project';
import { Benefit } from '../../../models/benefit';
import { Document } from '../../../models/document';
import { Role } from '../../../models/role';
import { Salary } from '../../../models/salary';
import { Responsibility } from '../../hr/responsability';
import { UserProfileComponent } from "../user-profile/user-profile.component";
import { UserRoleInfoComponent } from "../user-role-info/user-role-info.component";
import { UserProjectsComponent } from "../user-projects/user-projects.component";
import { UserResponsibilitiesComponent } from "../user-responsibilities/user-responsibilities.component";

@Component({
  selector: 'app-user-overview',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, UserProfileComponent, UserRoleInfoComponent, UserProjectsComponent, UserResponsibilitiesComponent],
  templateUrl: './user-overview.component.html',
  styleUrl: './user-overview.component.css'
})
export class UserOverviewComponent implements OnInit {

  activeTab: string = 'personal-info';
  userinfo: User | undefined = undefined;
  userRoleinfo: UserRoleInfo | undefined = undefined;

  responsibilities: Responsibility[] = [];
  allAvailableResponsibilities: Responsibility[] = [];

  isEditingBenefits = false;

  editBenefitsForm: FormGroup;

  allAvailableProjects: Project[] = [];
  projects: UserProject[] = [];
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
        }
      });
    }
  }

  private populateForms(): void {
    this.setBenefitsFormArray(this.benefits);
  }


  getFormControl(formGroup: FormGroup, controlName: string): FormControl {
    const control = formGroup.get(controlName);
    if (control instanceof FormControl) {
      return control;
    }
    throw new Error(`Control '${controlName}' not found or is not a FormControl in the provided FormGroup.`);
  }

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

  onProjectsUpdated(updatedProjectIds: number[]): void {
    const userId = this.authService.getCurrentUserId();

    if (userId) {
      this.userService.updateUserProjects(userId, updatedProjectIds).subscribe({
        next: () => {
          this.notificationService.showSuccess('Proiectele au fost actualizate cu succes! 🎉');
          this.loadUserData();
        },
        error: (error) => {
          this.notificationService.showError('Eroare la actualizarea proiectelor!');
          console.error('Error updating user projects:', error);
        }
      });
    } else {
      this.notificationService.showError('ID utilizator invalid. Nu se pot actualiza proiectele.');
    }
  }

  onResponsibilitiesAssignedUpdated(updatedResponsibilityIds: number[]): void {
    const userId = this.authService.getCurrentUserId();
    if (userId !== null) {
      this.userService.updateUserResponsibilities(userId, updatedResponsibilityIds).subscribe({
        next: () => {
          this.notificationService.showSuccess('Responsabilitățile utilizatorului au fost actualizate cu succes!');
          this.loadUserData(); // Re-încarcă datele pentru a reflecta schimbările
        },
        error: (error) => {
          this.notificationService.showError('Eroare la actualizarea responsabilităților utilizatorului!');
          console.error('Error updating user responsibilities:', error);
        }
      });
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