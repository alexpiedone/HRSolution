
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface Notification {
  type: 'success' | 'error' | 'info' | 'warning'; 
  message: string; 
  title?: string; 
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();

  constructor() { }

  get notification$(): Observable<Notification> {
    return this.notificationSubject.asObservable();
  }

  showSuccess(message: string, title: string = 'Succes!'): void {
    this.notificationSubject.next({ type: 'success', message, title });
  }

  showError(message: string, title: string = 'Eroare!'): void {
    this.notificationSubject.next({ type: 'error', message, title });
  }

  showInfo(message: string, title: string = 'Informație'): void {
    this.notificationSubject.next({ type: 'info', message, title });
  }

  showWarning(message: string, title: string = 'Atenție!'): void {
    this.notificationSubject.next({ type: 'warning', message, title });
  }
}