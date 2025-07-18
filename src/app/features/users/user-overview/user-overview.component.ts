import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Project, UserProject } from '../../../models/project';
import { Benefit } from '../../../models/benefit';
import { Document } from '../../../models/document';
import { Role } from '../../../models/role';
import { Salary } from '../../../models/salary';
import { UsersService } from '../users.service';
import { User, UserRoleInfo } from '../../../models/user';
import { AuthService } from '../../auth/auth.service';
import { Responsibility } from '../../hr/responsability';

@Component({
  selector: 'app-user-overview',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-overview.component.html',
  styleUrl: './user-overview.component.css'
})
export class UserOverviewComponent {

  activeTab: string = 'personal-info';

  projects: UserProject[] = [];

  responsibilities: Responsibility[] = [];

  roles: Role[] = [];

  currentSalary: Salary | null = null;

  userinfo: User | null = null;
  email: string = '';
  phone: string = '';

  userRoleinfo: UserRoleInfo | null = null;

  benefits: Benefit[] = [];

  documents: Document[] = [];

  isEditing = false;
  editProfileForm: FormGroup;


  constructor(private userService: UsersService, private authService: AuthService, private fb: FormBuilder) {
     this.editProfileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
    const userId = authService.getCurrentUserId();
    if (userId !== null) {
      this.userService.getUserInfo(userId).subscribe(user => {
        this.userinfo = user;
        if (this.userinfo) {
          this.email = this.userinfo.email;
          this.phone = this.userinfo.phone;
        }
      });
      this.userService.getUserRoleInfo(userId).subscribe(roleinfo => {
        this.userRoleinfo = roleinfo;
      });
      this.userService.getUserResponsibilities(userId).subscribe(
        (responsibilities: Responsibility[]) => {
          this.responsibilities = responsibilities;
        }
      );
      this.userService.getUserProjects(userId).subscribe(
        (projects: UserProject[]) => {
          this.projects = projects;
        }
      );
      this.userService.getUserBenefits(userId).subscribe(
        (benefits: Benefit[]) => {
          this.benefits = benefits;
        }
      );
      this.userService.getUserDocuments(userId).subscribe(
        (documents: Document[]) => {
          this.documents = documents;
        }
      );
      this.userService.getUserCurrentSalary(userId).subscribe(
        (salary: Salary) => {
          this.currentSalary = salary;
        }
      );
    }
  }

  enterEditMode(): void {
    this.isEditing = true;
    this.editProfileForm.patchValue({
      email: this.userinfo!.email,
      phone: this.userinfo!.phone
    });
  }
  cancelEdit(): void {
    this.isEditing = false;
  }

  saveChanges(): void {
    if (this.editProfileForm.valid) {
      const updatedData = this.editProfileForm.value;

      console.log('Date salvate:', updatedData);

      this.userinfo!.email = updatedData.email;
      this.userinfo!.phone = updatedData.phone;

      this.isEditing = false;
    } else {
      console.log('Formularul nu este valid.');
    }
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

}
