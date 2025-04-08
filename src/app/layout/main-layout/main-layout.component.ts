import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [HeaderComponent, FooterComponent, SidebarComponent, RouterOutlet],  
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  title = 'HRSolution';

  collapsed = false;

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }
}
