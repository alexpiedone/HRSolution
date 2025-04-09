import { Component , Input } from '@angular/core';
import {CardModule} from 'primeng/card';
import { CommonModule } from '@angular/common';


export interface PiecardCard {
  header: string;
  content: string;
  action?: {
    type: 'button' | 'link';
    label: string;
    onClick?: () => void;
    href?: string;
  };
}



@Component({
  selector: 'app-piecard',
  imports: [CardModule, CommonModule],
  templateUrl: './piecard.component.html',
  styleUrl: './piecard.component.css'
})
export class PiecardComponent {
  @Input() card!: PiecardCard;
}
