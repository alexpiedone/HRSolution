import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { Avatar } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { PiecardCard, PiecardComponent } from '../shared/piecard/piecard.component';
import { PielistComponent } from '../shared/pielist/pielist.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule, Avatar, CardModule, Divider, PiecardComponent, PielistComponent, InputTextModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  showColleagues = false;
  searchText = '';
  toggleColleagues() {
    this.showColleagues = !this.showColleagues;
  };

  tasks = [
    {
      label: 'Semnează SSM',
      done: false,
      action: { type: 'redirect', url: '/Documents' }
    },
    {
      label: 'Trimite pontajul pe luna curentă',
      done: false,
      action: { type: 'redirect', url: '/Documents' }
    },
    {
      label: 'Completează evaluare performance',
      done: true
    },
    {
      label: 'Actualizează informațiile de contact',
      done: false,
      action: { type: 'redirect', url: '/Documents' }
    },
    {
      label: 'Completează chestionarul de satisfacție',
      done: true
    },
    {
      label: 'Încarcă documentele de recrutare pentru noul angajat',
      done: false,
      action: { type: 'button' }
    }
  ];


  cards: PiecardCard[] = [
    {
      header: 'Colleagues',
      action: {
        type: 'button',
        label: 'Accesează colegii',
        onClick: () => this.toggleColleagues()
      }
    },
    {
      header: 'Training',
      action: {
        type: 'link',
        label: 'Vezi cursuri',
        href: '/training'
      }
    },
    {
      header: 'Documents',
    }
  ];

  notifications = [
    {
      label: 'Nouă actualizare disponibilă!',
      action: { type: 'notification'},
      dismissed: false
    },
    {
      label: 'Ești invitat la o ședință la ora 15:00',
      action: { type: 'notification'},
      dismissed: false
    },
    
    {
      label: 'Pe 15 Aprilie te asteapta un cadou din partea iepurasului de Paște!',
      action: { type: 'notification'},
      dismissed: false
    },
  ];

  colleagues = [
    { 
      name: 'Shadow', 
      avatar: 'fearless-tab-shadow.png', 
      role: 'Lead Developer', 
      responsibilities: 'Developing the core application features and leading the development team.' 
    },
    { 
      name: 'Tails', 
      avatar: 'tails.png', 
      role: 'Frontend Developer', 
      responsibilities: 'Building and maintaining the user interface and ensuring responsiveness.' 
    },
    { 
      name: 'Knuckles', 
      avatar: 'knuckles.png', 
      role: 'Backend Developer', 
      responsibilities: 'Developing server-side logic and APIs for the application.' 
    },
    { 
      name: 'Dr. Eggman', 
      avatar: 'drEggman.png', 
      role: 'Project Manager', 
      responsibilities: 'Managing project timelines, ensuring team productivity, and overseeing the workflow.' 
    }
  ];

  filteredColleagues() {
    const query = this.searchText.toLowerCase();
    return this.colleagues.filter(person =>
      person.name.toLowerCase().includes(query) ||
      person.role.toLowerCase().includes(query) ||
      person.responsibilities.toLowerCase().includes(query)
    );
  }
}
