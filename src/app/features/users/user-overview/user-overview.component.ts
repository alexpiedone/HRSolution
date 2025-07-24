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
import { CompensationComponent } from "../../compensation/compensation.component";
import { UserResponsibilitiesComponent } from "../user-responsibilities/user-responsibilities.component";
import { DocumentManagerComponent } from "../../documents/documents-manager/documents-manager.component";

@Component({
  selector: 'app-user-overview',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, UserProfileComponent, UserRoleInfoComponent, UserProjectsComponent, CompensationComponent, UserResponsibilitiesComponent, DocumentManagerComponent],
  templateUrl: './user-overview.component.html',
  styleUrl: './user-overview.component.css'
})
export class UserOverviewComponent implements OnInit {

  activeTab: string = 'personal-info';
  userinfo: User | undefined = undefined;
  userRoleinfo: UserRoleInfo | undefined = undefined;

  responsibilities: Responsibility[] = [];
  allAvailableResponsibilities: Responsibility[] = [];
  currentUserId: number | null = null;

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
    this.currentUserId = this.authService.getCurrentUserId();
    if (this.currentUserId === null) {
      this.notificationService.showError('Nu s-a putut obține ID-ul utilizatorului curent.');
    }
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

        },
        error: (error) => {
          this.notificationService.showError('Eroare la încărcarea datelor utilizatorului!');
        }
      });
    }
  }

  getFormControl(formGroup: FormGroup, controlName: string): FormControl {
    const control = formGroup.get(controlName);
    if (control instanceof FormControl) {
      return control;
    }
    throw new Error(`Control '${controlName}' not found or is not a FormControl in the provided FormGroup.`);
  }


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

  onBenefitsUpdated(updatedBenefits: Benefit[]): void {
    const userId = this.authService.getCurrentUserId();
    if (userId !== null) {
      this.userService.updateUserBenefits(userId, updatedBenefits).subscribe({
        next: () => {
          this.notificationService.showSuccess('Beneficiile utilizatorului au fost actualizate cu succes!');
          this.loadUserData();
        },
        error: (error) => {
          this.notificationService.showError('Eroare la actualizarea beneficiilor utilizatorului!');
          console.error('Error updating user benefits:', error);
        }
      });
    }
  }

  changeTab(tabId: string): void {
    this.activeTab = tabId;
  }
  onDocumentsRefreshed(): void {
    this.loadUserData();
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