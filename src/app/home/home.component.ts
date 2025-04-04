import { Component } from '@angular/core';
import { MegaMenuItem, MenuItem } from 'primeng/api';
import {CommonModule} from '@angular/common'
import {MegaMenu} from 'primeng/megamenu'
import {Avatar} from 'primeng/avatar'

@Component({
  selector: 'app-home',
  imports: [ MegaMenu, Avatar, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  items: MegaMenuItem[] = [];

  ngOnInit() {
    this.items = [
      { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: '/home', root: true },
      { label: 'Requests', icon: 'pi pi-fw pi-reply', routerLink: '/requests', root: true },
      { label: 'Evaluations', icon: 'pi pi-fw pi-trophy', routerLink: '/evaluations', root: true },
      { label: 'Documents', icon: 'pi pi-fw pi-pen-to-square', routerLink: '/documents', root: true },
      { label: 'Settings', icon: 'pi pi-fw pi-cog', routerLink: '/settings', root: true },
    ];
    
  }
}
