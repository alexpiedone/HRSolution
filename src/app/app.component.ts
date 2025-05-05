import { Component } from '@angular/core';
import { ErrorDialogComponent } from './shared/pie-error-dialog/pie-error-dialog.component';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [ RouterModule, ErrorDialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
}
