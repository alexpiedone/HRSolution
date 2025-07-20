import { Component } from '@angular/core';
import { ErrorDialogComponent } from './shared/pie-error-dialog/pie-error-dialog.component';
import { RouterModule } from '@angular/router';
import { PieDialogComponent } from "./shared/pie-dialog/pie-dialog.component";
@Component({
  selector: 'app-root',
  imports: [RouterModule, ErrorDialogComponent, PieDialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
}
