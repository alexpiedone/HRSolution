import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Avatar } from 'primeng/avatar';
import { PanelMenu } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';



@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, Avatar, PanelMenu],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() collapsed = false; 
  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }
  menuItems: MenuItem[] = [];

  
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
  }
}
