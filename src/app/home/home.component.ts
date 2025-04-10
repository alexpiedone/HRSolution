import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { Avatar } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { PiecardCard, PiecardComponent } from '../shared/piecard/piecard.component';
import { PielistComponent } from '../shared/pielist/pielist.component';

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule, Avatar, CardModule, Divider, PiecardComponent, PielistComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  showColleagues = false;
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
  ];
}
