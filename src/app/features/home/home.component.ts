import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { Avatar } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { PiecardCard, PiecardComponent } from '../../shared/piecard/piecard.component';
import { PielistComponent } from '../../shared/pielist/pielist.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { NewsService } from '../news/news.service';
import { UsersService } from '../users/users.service';
import { EventComponent } from "../event/event.component";
import { Event } from '../../models/event';

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule, Avatar, CardModule,
    Divider, PiecardComponent, PielistComponent,
    InputTextModule, FormsModule, Dialog, EventComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  showColleagues: boolean = false;
  displayDialog: boolean = false;
  showAvatarDialog: boolean = false;
  selectedColleague: any = null;
  searchText = '';
  news: any[] = [];
  colleagues: any[] = [];
 
  constructor(private newsService: NewsService, private usersService: UsersService) { }
  ngOnInit() {
      this.newsService.getAll().subscribe((data) => {
        this.news = data.map(item => ({
          label: item.title,
          description: item.content
        }));
      });
  }
  private loadColleagues(): void {
    this.usersService.getColleagues().subscribe({
      next: (data) => {
        this.colleagues = data;
      },
      error: (err) => {
        console.error('Error loading colleagues', err);
      }
    });
  }
  toggleColleagues() {
    this.showColleagues = !this.showColleagues;
    if (this.showColleagues) {
      this.loadColleagues();
    }
  };

  selectColleague(colleague: any) {
    this.selectedColleague = colleague;
    this.displayDialog = true;
  }

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

  upcomingEvents: Event[] = [
    {
      id: '1',
      title: 'Team Wellness Check-in',
      date: new Date(), // Today
      location: 'Virtual meeting',
      duration: '30 minutes'
    },
    {
      id: '2',
      title: 'Mindfulness Workshop',
      date: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
      location: 'Conference Room A',
      duration: '1 hour'
    },
    {
      id: '3',
      title: 'Team Building: Virtual Escape Room',
      date: new Date(new Date().setDate(new Date().getDate() + 3)), // 3 days from now
      location: 'Virtual event',
      duration: '1 hour'
    },
    {
      id: '2',
      title: 'Mindfulness Workshop',
      date: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
      location: 'Conference Room A',
      duration: '1 hour'
    },
    {
      id: '3',
      title: 'Team Building: Virtual Escape Room',
      date: new Date(new Date().setDate(new Date().getDate() + 3)), // 3 days from now
      location: 'Virtual event',
      duration: '1 hour'
    }
  ];

  onEventSelected(event: Event) {
    console.log('Event selected:', event);
    // Navigate to event details or show modal
  }

  onViewAllEvents() {
    console.log('View all events clicked');
    // Navigate to full events page
  }


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


  filteredColleagues() {
    const query = this.searchText.toLowerCase();
    return this.colleagues.filter(person =>
      person.name.toLowerCase().includes(query) ||
      person.role.toLowerCase().includes(query) ||
      person.responsibilities.toLowerCase().includes(query)
    );
  }
}
