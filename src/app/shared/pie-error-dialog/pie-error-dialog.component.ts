import { Component, Input } from '@angular/core';
import { ErrorService } from '../../core/services/error.service';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'pie-error-dialog',
  imports: [DialogModule],
  template: `
    <p-dialog [(visible)]="display" [modal]="true" [closable]="false" [dismissableMask]="true" [style]="{width: '400px'}">
      <ng-template pTemplate="header">
        <div class="flex items-center space-x-2">
          <i class="pi pi-exclamation-triangle text-yellow-500"></i>
          <span class="font-semibold text-lg">Eroare</span>
        </div>
      </ng-template>
      <div class="p-4 text-gray-700">
        {{ message }}
      </div>
      <ng-template pTemplate="footer">
        <button (click)="close()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
          OK
        </button>
      </ng-template>
    </p-dialog>
  `,
})
export class ErrorDialogComponent {
  display = false;
  message = '';

  constructor(private errorService: ErrorService) {
    this.errorService.error$.subscribe((message) => {
      this.message = message;
      this.display = true;
    });
  }

  close() {
    this.display = false;
  }
  
}
