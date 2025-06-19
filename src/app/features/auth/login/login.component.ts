import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth'; 
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel'; 
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    PasswordModule,
    FloatLabelModule, 
    CheckboxModule,
    CommonModule 
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage: string | null = null; 
  showPassword = false; 

  constructor(private authService: AuthService, private router: Router, private auth: Auth) { }

  signInWithGoogle(): void {
    signInWithPopup(this.auth, new GoogleAuthProvider())
      .then(result => {
        console.log('Autentificare Google reușită:', result.user);
        this.router.navigate(['/home']); 
      })
      .catch(error => {
        console.error('Eroare de autentificare cu Google:', error);
        this.errorMessage = 'Autentificare Google eșuată. Vă rugăm să încercați din nou.';
      });
  }

  onSubmit(): void {
    this.errorMessage = null; 

    if (!this.username || !this.password) {
      this.errorMessage = 'Numele de utilizator și parola sunt obligatorii.';
      return;
    }

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: response => {
        console.log('Login reușit:', response);
        this.router.navigate(['/home']); 
      },
      error: error => {
        this.errorMessage = error.message || 'Login eșuat. Vă rugăm să verificați credențialele.';
      }
    });
  }
}