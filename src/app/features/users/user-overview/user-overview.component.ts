import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../models/project';
import { Benefit } from '../../../models/benefit';
import { Document } from '../../../models/document';
import { Role } from '../../../models/role';
import { CurrentSalary, SalaryRecord } from '../../../models/salary';

@Component({
  selector: 'app-user-overview',
  imports: [CommonModule],
  templateUrl: './user-overview.component.html',
  styleUrl: './user-overview.component.css'
})
export class UserOverviewComponent {
  activeTab: string = 'personal-info';
  projects: Project[] = [];
  responsabilities: string[] = [];
  benefits: Benefit[] = [];
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


  roleInfo = {
    position: 'Frontend Developer',
    department: 'Engineering',
    team: 'Web Applications',
    manager: 'Michael Chen'
  };

  // projects = [
  //   { name: 'HR Dashboard Redesign', role: 'Frontend Development', status: 'Active', statusClass: 'badge-success' },
  //   { name: 'Employee Mobile App', role: 'UI Implementation', status: 'Planning', statusClass: 'badge-warning' },
  //   { name: 'Company Website', role: 'Maintenance', status: 'Ongoing', statusClass: 'badge-info' }
  // ];

  // responsibilities = [
  //   'Frontend Development', 'UI Implementation', 'React.js', 'Vue.js',
  //   'CSS/SCSS', 'Responsive Design', 'Performance Optimization',
  //   'Code Reviews', 'Documentation'
  // ];

  // benefits = [
  //   { name: 'Health Insurance', description: 'Premium Coverage' },
  //   { name: 'Meal Vouchers', description: '$15 per working day' },
  //   { name: 'Learning Budget', description: '$1,000 annually' },
  //   { name: 'Flexible Hours', description: 'Core hours: 10 AM - 4 PM' },
  //   { name: 'Remote Work', description: '2 days per week' }
  // ];

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
