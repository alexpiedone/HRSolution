import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})


export class LoginComponent {
  username = '';
  password = '';

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
}
