import { Component } from '@angular/core';
import {CommonModule} from '@angular/common'
import {RouterModule} from '@angular/router'
import { Avatar } from 'primeng/avatar';
import {CardModule} from 'primeng/card';
import {Divider} from 'primeng/divider';

@Component({
  selector: 'app-home',
  imports: [ RouterModule, CommonModule, Avatar, CardModule,Divider],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  colleagues = [
    {
      name : 'Alex Dobre',
      avatar : 'fearless-tab-shadow.png',
    }]
}
