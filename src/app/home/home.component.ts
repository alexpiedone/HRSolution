import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { Avatar } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { PiecardCard } from '../shared/piecard/piecard.component';

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule, Avatar, CardModule, Divider],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  showColleagues = false;
  toggleColleagues() {
    this.showColleagues = !this.showColleagues;
  }


  cards: PiecardCard[] = [
    {
      header: 'Colleagues',
      content: 'Accesează colegii tăi.',
      action: {
        type: 'button',
        label: 'Accesează colegii',
        onClick: () => this.toggleColleagues()
      }
    },
    {
      header: 'Training',
      content: 'Accesează cursurile de dezvoltare profesională.',
      action: {
        type: 'link',
        label: 'Vezi cursuri',
        href: '/training'
      }
    },
    {
      header: 'Documents',
      content: 'Accesează documentele personale și de companie.'
    }
  ];


  colleagues = [
    {
      name: 'Shadow', avatar: 'fearless-tab-shadow.png',
    },
    {
      name: 'Tails', avatar: 'tails.png',
    },
    {
      name: 'Knuckles', avatar: 'knuckles.png',
    },
    {
      name: 'Dr. Eggman', avatar: 'drEggman.png',
    }
  ]
}
