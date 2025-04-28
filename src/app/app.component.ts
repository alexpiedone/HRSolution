import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorDialogComponent } from './shared/pie-error-dialog/pie-error-dialog.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ErrorDialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
}
