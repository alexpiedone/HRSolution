import { Component } from '@angular/core';
import { MegaMenuItem, MenuItem } from 'primeng/api';
import {CommonModule} from '@angular/common'
import {MegaMenu} from 'primeng/megamenu'
import {Avatar} from 'primeng/avatar'
import {RouterModule} from '@angular/router'
import {MegaMenuModule} from 'primeng/megamenu'

import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';
@Component({
  selector: 'app-home',
  imports: [ RouterModule, CommonModule, SidebarModule, PanelMenuModule, MegaMenuModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  items: MegaMenuItem[] = [];
  collapsed = false;
  visibleSidebar: boolean = false;
  ngOnInit() {
    this.items = [
      { label: 'Home', icon: 'pi  pi-home', routerLink: '/home', root: true },
      { label: 'Requests', icon: 'pi  pi-reply', routerLink: '/requests', root: true },
      { label: 'Evaluations', icon: 'pi  pi-trophy', routerLink: '/evaluations', root: true },
      { label: 'Documents', icon: 'pi  pi-pen-to-square', routerLink: '/documents', root: true },
      { label: 'Settings', icon: 'pi  pi-cog', routerLink: '/settings', root: true },
    ];
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }
}
