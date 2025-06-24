import { Injectable, PLATFORM_ID, Inject } from '@angular/core'; // Adaugă PLATFORM_ID și Inject
import { isPlatformBrowser } from '@angular/common'; // Adaugă isPlatformBrowser
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string;           // Username
  email?: string;        // Email (opțional)
  nameid: string;        // User ID (venit din ClaimTypes.NameIdentifier)
  exp: number;           // Expirare în timestamp UNIX
}

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
  private apiUrl = 'https://localhost:7124/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // Injectează platformId
  ) {
    this.checkInitialAuthStatus();
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      const isLoggedIn = !!token;
      this.isAuthenticatedSubject.next(isLoggedIn);
      return isLoggedIn;
    }
    return false;
  }


  private setAuthenticated(token: string): void {
    if (isPlatformBrowser(this.platformId)) { // Verifică înainte de a folosi localStorage
      localStorage.setItem('authToken', token);
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response && response.token) {
          this.setAuthenticated(response.token); 
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      this.isAuthenticatedSubject.next(false);
    }
    this.router.navigate(['/auth/login']);
  }

  
  registerUser(username: string, password: string, email: string, companyId: number): Observable<string> {
    const url = `${this.apiUrl}/register?username=${username}&password=${password}&email=${email}&companyId=${companyId}`;
    return this.http.get<string>(url).pipe(
      catchError(this.handleError)
    );
  }

  
  private checkInitialAuthStatus(): void {
    this.isAuthenticated(); 
  }

 
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'A apărut o eroare necunoscută.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Eroare la client: ${error.error.message}`;
    } else {
      errorMessage = `Cod eroare backend: ${error.status}, mesaj: ${error.error}`;
      if (error.status === 401) {
        errorMessage = 'Credențiale invalide. Vă rugăm să verificați numele de utilizator și parola.';
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }


  getDecodedToken(): DecodedToken | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          return jwtDecode<DecodedToken>(token);
        } catch (e) {
          console.error('Token invalid sau corupt', e);
          return null;
        }
      }
    }
    return null;
  }


  getCurrentUserId(): number | null {
    const decoded = this.getDecodedToken();
    console.log('Decoded token:', decoded);
    return decoded ? parseInt(decoded.nameid) : null;
  }
  

  getCurrentUserFullname(): string {
    const decoded = this.getDecodedToken();
    const fullname = decoded == null ? '' : decoded.sub;
    return fullname;
  }


  getCurrentUserEmail(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.email ?? null;
  }

  isTokenExpired(): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded) return true;

    const currentTime = Math.floor(Date.now() / 1000); 
    return decoded.exp < currentTime;
  }

}