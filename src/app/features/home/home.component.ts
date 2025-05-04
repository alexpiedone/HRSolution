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
import { TaskService } from '../task/task.service';

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
  news: NewsItem[] = [];
  tasks: Task[] = [];
  events: any[] = [];
  colleagues: any[] = [];

  constructor(private newsService: NewsService,
    private usersService: UsersService,
    private eventService: EventsService,
    private tasksService: TaskService) { }
  ngOnInit() {

    this.eventService.getAll().subscribe((data) => {
      this.events = data.map(item => ({
        title: item.title,
        date: item.date,
        location: item.location,
        duration: item.duration,
        description: item.description
      }));
    });
    this.newsService.GetAllDTO().subscribe((data) => {
      this.news = data;
    });

    this.tasksService.GetAllDTO().subscribe((data) => {
      this.tasks = data;
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
