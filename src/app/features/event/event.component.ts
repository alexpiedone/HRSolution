import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event } from '../../models/event';
@Component({
  selector: 'app-event',
  imports: [CommonModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent {
  @Input() events: Event[] = [];
  @Output() selectEvent = new EventEmitter<Event>();
  @Output() viewAll = new EventEmitter<void>();

  getFormattedDate(date: Date): string {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const eventDate = new Date(date);
    
    if (this.isSameDay(eventDate, today)) {
      return `Today, ${this.formatTime(eventDate)}`;
    } else if (this.isSameDay(eventDate, tomorrow)) {
      return `Tomorrow, ${this.formatTime(eventDate)}`;
    } else {
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      };
      return eventDate.toLocaleDateString('en-US', options);
    }
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
}
