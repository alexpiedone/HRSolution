import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})


export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        // Autentificare reușită
        this.router.navigate(['/people']); // Navighează către pagina principală
      },
      error => {
        // Afișează un mesaj de eroare
        console.error('Eroare de autentificare:', error);
      }
    );
  }
}
