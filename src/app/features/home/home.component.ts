import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { Avatar } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { PiecardCard, PiecardComponent } from '../../shared/piecard/piecard.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { NewsService } from '../news/news.service';
import { UsersService } from '../users/users.service';
import { EventComponent } from "../event/event.component";
import { Event } from '../../models/event';
import { map } from 'rxjs';
import { EventsService } from '../event/event.service';
import { TaskComponent } from "../task/task.component";
import { Task } from '../../models/task';
import { NewsletterComponent } from "../news/newsletter/newsletter.component";
import { NewsItem } from '../../models/newsitem';

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule, Avatar, CardModule,
    Divider, PiecardComponent,
    InputTextModule, FormsModule, Dialog, EventComponent, TaskComponent, NewsletterComponent],
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
  events: any[] = [];
  colleagues: any[] = [];
 
  constructor(private newsService: NewsService, private usersService: UsersService, private eventService: EventsService) { }
  ngOnInit() {
      
      this.eventService.getAll().subscribe((data) => {
        this.events = data.map( item => ({
          title: item.title,
          date: item.date,
          location: item.location,
          duration: item.duration,
          description: item.description}));
      });
      

  }

  newsItems: NewsItem[] = [
    {
      id: '1',
      title: 'Quarterly Company Update: Q2 2023',
      description: 'Join us for our quarterly company update where we\'ll discuss our achievements, challenges, and plans for the upcoming quarter.',
      category: 'Announcement',
      date: new Date('2023-06-15'),
      author: {
        name: 'Michael Johnson',
        initials: 'MJ',
        color: 'blue'
      },
      isFeatured: true,
      action: {
        type: 'link',
        url: '/news/quarterly-update'
      }
    },
    {
      id: '2',
      title: 'New Health Insurance Benefits',
      description: 'We\'re excited to announce updates to our health insurance benefits package.',
      category: 'Event',
      date: new Date('2023-06-10'),
      author: {
        name: 'Sarah Lee',
        initials: 'SL',
        color: 'green'
      }
    },
    // Add more news items...
  ];
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

  onTaskUpdate(updatedTask: Task) {
    // Actualizează task-ul în backend
  }
  
  onTaskDelete(taskName: string) {
    // Șterge task-ul din backend
  }
  
  onTaskAction(action: any) {
    // Alte acțiuni
  }
  
  openAddTaskDialog() {
    // Deschide dialog pentru adăugare task nou
  }
  tasksUpdated: Task[] = [
    {
      name: 'Review project proposal',
      description: ' feedback.',
      status: 'Pending',
      dueDate: new Date('2023-06-15'),
      priority: 'high',
      assignedTo: 'John Doe',
      createdBy: 'Manager',
      action: { type: 'redirect', url: '/projects/123' }
    },
    // ... alte task-uri
  ];
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

  onEventSelected(event: Event) {
    console.log('Event selected:', event);
  }

  onViewAllEvents() {
    console.log('View all events clicked');
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
