import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { UpdateRoleDto, User, UserRoleInfo } from '../../../models/user';
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

@Component({
  selector: 'app-user-overview',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, GenericDropdownComponent],
  templateUrl: './user-overview.component.html',
  styleUrl: './user-overview.component.css'
})
export class UserOverviewComponent implements OnInit {

  activeTab: string = 'personal-info';
  userinfo: User | null = null;
  userRoleinfo: UserRoleInfo | null = null;
  isEditingProfile = false;
  isEditingRole = false;

  editProfileForm: FormGroup;
  editRoleForm: FormGroup;

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
    this.editProfileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });

    this.editRoleForm = this.fb.group({
      position: [null, Validators.required],
      department: [null, Validators.required],
      team: [null],
      manager: [null]
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
        userCurrentSalary: this.userService.getUserCurrentSalary(userId)
      }).pipe(
        take(1),
        finalize(() => { })
      ).subscribe({
        next: ({ userInfo, userRoleInfo, userResponsibilities, userProjects, userBenefits, userDocuments, userCurrentSalary }) => {
          this.userinfo = userInfo;
          this.userRoleinfo = userRoleInfo;
          this.responsibilities = userResponsibilities;
          this.projects = userProjects;
          this.benefits = userBenefits;
          this.documents = userDocuments;
          this.currentSalary = userCurrentSalary;

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
    if (this.userinfo) {
      this.editProfileForm.patchValue({
        email: this.userinfo.email,
        phone: this.userinfo.phone
      });
    }

    if (this.userRoleinfo) {
      this.editRoleForm.patchValue({
        position: this.userRoleinfo.positionId,
        department: this.userRoleinfo.departmentId,
        team: this.userRoleinfo.teamId,
        manager: this.userRoleinfo.managerId
      });
    }
  }

  getFormControl(controlName: string): FormControl {
    const control = this.editRoleForm.get(controlName);
    if (control instanceof FormControl) {
      return control;
    }
    throw new Error(`Control '${controlName}' not found or is not a FormControl.`);
  }

  enterEditModeProfile(): void {
    this.isEditingProfile = true;
    this.populateForms();
  }

  cancelEditProfile(): void {
    this.isEditingProfile = false;
    this.populateForms();
  }

  saveProfileChanges(): void {
    if (this.editProfileForm.valid) {
      const updatedData = this.editProfileForm.value;
      const userId = this.authService.getCurrentUserId();

      if (userId) {
        this.userService.updateUserInfo(userId, updatedData).subscribe({
          next: () => {
            this.notificationService.showSuccess('Profil actualizat cu succes! 🥳');
            this.userinfo = { ...this.userinfo, ...updatedData } as User;
            this.isEditingProfile = false;
          },
          error: (error) => {
            this.notificationService.showError('Eroare la actualizarea profilului!');
            console.error('Error updating user info:', error);
          }
        });
      }
    }
  }

  enterEditModeRole(): void {
    this.isEditingRole = true;
    this.populateForms();
  }

  cancelEditRole(): void {
    this.isEditingRole = false;
    this.populateForms();
  }

  saveRoleChanges(): void {
    if (this.editRoleForm.valid) {
      const updatedData: UpdateRoleDto = {
        positionId: this.editRoleForm.get('position')?.value,
        departmentId: this.editRoleForm.get('department')?.value,
        teamId: this.editRoleForm.get('team')?.value,
        managerId: this.editRoleForm.get('manager')?.value
      };
      const userId = this.authService.getCurrentUserId();

      if (userId) {
        this.userService.updateUserRoleInfo(userId, updatedData).subscribe({
          next: () => {
            this.notificationService.showSuccess('Informațiile rolului au fost actualizate cu succes! 🎉');
            if (this.userRoleinfo) {
              this.userRoleinfo.positionId = updatedData.positionId ?? 0;
              this.userRoleinfo.departmentId = updatedData.departmentId ?? 0;
              this.userRoleinfo.teamId = updatedData.teamId ?? null;
              this.userRoleinfo.managerId = updatedData.managerId ?? null;
            }
            this.isEditingRole = false;
          },
          error: (error) => {
            this.notificationService.showError('Eroare la actualizarea informațiilor rolului!');
            console.error('Error updating user role info:', error);
          }
        });
      }
    } else {
      this.notificationService.showError('Vă rugăm să completați toate câmpurile obligatorii!');
      this.editRoleForm.markAllAsTouched();
    }
  }

  onPositionSelectionChange(value: number | string | null): void {
    console.log('New position selected:', value);
  }

  onDepartmentSelectionChange(value: number | string | null): void {
    console.log('New department selected:', value);
  }

  onTeamSelectionChange(value: number | string | null): void {
    console.log('New team selected:', value);
  }

  onManagerSelectionChange(value: number | string | null): void {
    console.log('New manager selected:', value);
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