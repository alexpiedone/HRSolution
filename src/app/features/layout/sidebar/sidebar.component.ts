import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Avatar } from 'primeng/avatar';
import { PanelMenu } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, Avatar, PanelMenu, ButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() collapsed = false; 
  userfullname = '';

  constructor(private router: Router,
     private authService: AuthService) {}

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }
  menuItems: MenuItem[] = [];

  navigateToProfile() {
    this.router.navigate(['/user-overview']);
  }
  ngOnInit() {
    this.menuItems = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: '/home'
      },
      {
        label: 'People',
        icon: 'pi pi-users',
        items: [
          { label: 'Employees', icon: 'pi pi-id-card', routerLink: '/EmployeeDetails' }
        ]
      },
      {
        label: 'Requests',
        icon: 'pi pi-calendar',
        items: [
          { label: 'Leave Requests', icon: 'pi pi-clock', routerLink: '/leaveRequest' }
        ]
      },
      {
        label: 'Documents',
        icon: 'pi pi-file',
        routerLink: '/Documents'
      },
      {
        label: 'Timesheet',
        icon: 'pi pi-calendar',
        routerLink: '/timesheet'
      }
    ];
    this.userfullname = this.authService.getCurrentUserFullname();
  }
}
