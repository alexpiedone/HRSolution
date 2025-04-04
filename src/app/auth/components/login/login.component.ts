import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { FloatLabel } from 'primeng/floatlabel';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-login',
  imports: [FormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    PasswordModule,
    FloatLabel,
    CheckboxModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})


export class LoginComponent {
  username = '';
  password = '';
  showPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router, private auth: Auth, ) { }
  signInWithGoogle(): void {
    signInWithPopup(this.auth, new GoogleAuthProvider())
      .then(result => {
        this.router.navigate(['/home']);
      })
      .catch(error => {
        console.error('Eroare de autentificare cu Google:', error);
      });
  }

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        this.router.navigate(['/people']);
      },
      error => {
        console.error('Eroare de autentificare:', error);
      }
    );
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  
}
