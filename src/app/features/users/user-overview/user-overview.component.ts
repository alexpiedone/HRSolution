import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project, UserProject } from '../../../models/project';
import { Benefit } from '../../../models/benefit';
import { Document } from '../../../models/document';
import { Role } from '../../../models/role';
import { CurrentSalary, SalaryRecord } from '../../../models/salary';
import { UsersService } from '../users.service';
import { User, UserRoleInfo } from '../../../models/user';
import { AuthService } from '../../auth/auth.service';
import { Responsibility } from '../../hr/responsability';

@Component({
  selector: 'app-user-overview',
  imports: [CommonModule],
  templateUrl: './user-overview.component.html',
  styleUrl: './user-overview.component.css'
})
export class UserOverviewComponent {
  activeTab: string = 'personal-info';
  projects: UserProject[] = [];
  responsibilities: Responsibility[] = [];
  // benefits: Benefit[] = [];
  employmentDocuments: Document[] = [];
  roles: Role[] = [];
  certificates: Document[] = [];
  otherDocuments: Document[] = [];
  currentSalary: CurrentSalary = {
    grossMonthly: '$5,800.00',
    netMonthly: '$4,350.00',
    annualBonus: '$6,960.00 (12%)',
    lastReview: 'March 20, 2023'
  };
  salaryHistory: SalaryRecord[] = [];
  userinfo: User | null = null;
  userRoleinfo: UserRoleInfo | null = null;


  benefits: Benefit[] = [
    {
      title: 'Health Insurance',
      description: 'Premium coverage for you and dependents'
    },
    {
      title: '401(k) Matching',
      description: '100% match up to 6% of salary',
      icon: 'wallet',
      color: 'green'
    },
    {
      title: 'Unlimited PTO',
      description: 'Flexible time off policy',
      icon: 'calendar',
      color: 'blue'
    },
    {
      title: 'Learning Stipend',
      description: '$1,500 annual education allowance',
      icon: 'book',
      color: 'yellow'
    },
    {
      title: 'Remote Work',
      description: 'Hybrid schedule with home office stipend',
      icon: 'home',
      color: 'red'
    }
  ];

  getStyles(color?: string): { bg: string; iconBg: string; text: string } {
    const c = color ?? 'blue';
    return {
      bg: `bg-${c}-50`,
      iconBg: `bg-${c}-200`,
      text: `text-${c}-400`
    };
  }


  constructor(private userService: UsersService, private authService: AuthService) {
    const userId = authService.getCurrentUserId();
    if (userId !== null) {
      this.userService.getUserInfo(userId).subscribe(user => {
        this.userinfo = user;
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
    }
  }

  // Documents Data
  // employmentDocuments = [
  //   { name: 'Employment Contract', date: 'Signed on March 15, 2021' },
  //   { name: 'Addendum - Role Change', date: 'Signed on November 10, 2022' },
  //   { name: 'Addendum - Salary Revision', date: 'Signed on March 20, 2023' }
  // ];

  // certificates = [
  //   { name: 'React Advanced Certification', date: 'Issued on July 15, 2022' },
  //   { name: 'UI/UX Design Fundamentals', date: 'Issued on September 5, 2022' },
  //   { name: 'Web Accessibility Training', date: 'Issued on February 20, 2023' }
  // ];

  // otherDocuments = [
  //   { name: 'Company Handbook', date: 'Latest version: 2023' },
  //   { name: 'IT Security Policy', date: 'Acknowledged on March 16, 2021' }
  // ];

  // Salary Data
  // currentSalary = {
  //   grossMonthly: '$5,800.00',
  //   netMonthly: '$4,350.00',
  //   annualBonus: '$6,960.00 (12%)',
  //   lastReview: 'March 20, 2023'
  // };

  // salaryHistory = [
  //   { date: 'March 20, 2023', amount: '$5,800.00', change: '+7.4%', changeClass: 'badge-success', reason: 'Annual Review' },
  //   { date: 'November 10, 2022', amount: '$5,400.00', change: '+12.5%', changeClass: 'badge-success', reason: 'Promotion' },
  //   { date: 'March 15, 2022', amount: '$4,800.00', change: '+6.7%', changeClass: 'badge-success', reason: 'Annual Review' },
  //   { date: 'March 15, 2021', amount: '$4,500.00', change: 'Initial', changeClass: 'badge-info', reason: 'Hiring' }
  // ];

  // Hierarchy Data
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
}
