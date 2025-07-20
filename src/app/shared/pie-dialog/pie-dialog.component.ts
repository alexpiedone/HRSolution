import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Notification, NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'pie-dialog',
  imports: [DialogModule, CommonModule],
  styleUrl: './pie-dialog.component.css',
  template: `
    <p-dialog [(visible)]="display" [modal]="true" [closable]="false" [dismissableMask]="true" [style]="{width: '400px'}">
      <ng-template pTemplate="header">
        <div class="flex items-center space-x-2">
          <ng-container [ngSwitch]="notificationType">
            <i *ngSwitchCase="'success'" class="pi pi-check-circle text-green-500 text-xl"></i>
            <i *ngSwitchCase="'error'" class="pi pi-exclamation-triangle text-red-500 text-xl"></i>
            <i *ngSwitchCase="'info'" class="pi pi-info-circle text-blue-500 text-xl"></i>
            <i *ngSwitchCase="'warning'" class="pi pi-exclamation-circle text-orange-500 text-xl"></i>
          </ng-container>
          <span class="font-semibold text-lg">{{ notificationTitle }}</span>
        </div>
      </ng-template>
      <div class="p-4 text-gray-700">
        {{ notificationMessage }}
      </div>
      <ng-template pTemplate="footer">
        <button (click)="close()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
          OK
        </button>
      </ng-template>
    </p-dialog>
  `,
})


export class PieDialogComponent {
   display = false;
  notificationMessage = '';
  notificationType: Notification['type'] = 'info'; 
  notificationTitle = '';

  constructor(private notificationService: NotificationService) { 
    this.notificationService.notification$.subscribe((notification: Notification) => {
      this.notificationMessage = notification.message;
      this.notificationType = notification.type;
      this.notificationTitle = notification.title || this.getDefaultTitle(notification.type);  
      this.display = true;
    });
  }

  private getDefaultTitle(type: Notification['type']): string {
    switch (type) {
      case 'success': return 'Succes!';
      case 'error': return 'Eroare!';
      case 'info': return 'Informație';
      case 'warning': return 'Atenție!';
      default: return 'Notificare';
    }
  }

  close() {
    this.display = false;
  }
  
}