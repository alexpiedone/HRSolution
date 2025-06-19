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

  // Injectăm PLATFORM_ID
  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // Injectează platformId
  ) {
    // La inițializarea serviciului, verifică starea inițială de autentificare
    this.checkInitialAuthStatus();
  }

  // Metoda care verifică dacă utilizatorul este autentificat
  isAuthenticated(): boolean {
    // Verifică dacă rulăm într-un browser înainte de a accesa localStorage
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      const isLoggedIn = !!token;
      this.isAuthenticatedSubject.next(isLoggedIn);
      return isLoggedIn;
    }
    // Dacă nu suntem într-un browser, considerăm că nu suntem autentificați
    return false;
  }

  /**
   * Stochează token-ul JWT și marchează utilizatorul ca autentificat.
   * @param token Token-ul JWT primit de la API.
   */
  private setAuthenticated(token: string): void {
    if (isPlatformBrowser(this.platformId)) { // Verifică înainte de a folosi localStorage
      localStorage.setItem('authToken', token);
      this.isAuthenticatedSubject.next(true);
    }
  }

  /**
   * Efectuează apelul API pentru login.
   * @param credentials Obiect cu username și password.
   * @returns Un Observable cu răspunsul de la API (LoginResponse).
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response && response.token) {
          this.setAuthenticated(response.token); // Salvează token-ul și setează starea de autentificare
        }
      }),
      // Gestionează erorile HTTP
      catchError(this.handleError)
    );
  }

  /**
   * Deloghează utilizatorul, elimină token-ul și redirecționează către pagina de login.
   */
  logout(): void {
    if (isPlatformBrowser(this.platformId)) { // Verifică înainte de a folosi localStorage
      localStorage.removeItem('authToken');
      this.isAuthenticatedSubject.next(false);
    }
    this.router.navigate(['/auth/login']);
  }

  // --- Metodă pentru Înregistrare (opțional, dacă vrei s-o integrezi aici) ---

  /**
   * Efectuează apelul API pentru înregistrarea unui utilizator.
   * Atenție: Metoda API-ului tău este GET, ceea ce nu e recomandat pentru operații de creare.
   * De obicei, înregistrarea se face printr-un POST cu un corp de cerere.
   *
   * @param username Numele de utilizator.
   * @param password Parola.
   * @param email Email-ul.
   * @param companyId ID-ul companiei.
   * @returns Un Observable cu răspunsul de la API.
   */
  registerUser(username: string, password: string, email: string, companyId: number): Observable<string> {
    const url = `${this.apiUrl}/register?username=${username}&password=${password}&email=${email}&companyId=${companyId}`;
    return this.http.get<string>(url).pipe(
      catchError(this.handleError)
    );
  }

  // --- Inițializare și Gestionare Erori ---

  /**
   * Verifică starea de autentificare la inițializarea serviciului.
   */
  private checkInitialAuthStatus(): void {
    this.isAuthenticated(); // Apelez metoda pentru a actualiza BehaviorSubject-ul
  }

  /**
   * Handler centralizat pentru erorile HTTP.
   * @param error Obiectul HttpErrorResponse.
   * @returns Un Observable care aruncă o eroare, pe care subscrierile o pot prinde.
   */
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


  /**
 * Decodifică JWT-ul din localStorage și returnează obiectul cu datele.
 * @returns Obiect cu datele decodate sau null dacă token-ul nu e valid.
 */
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

  /**
   * Returnează ID-ul utilizatorului din token, dacă este disponibil.
   */
  getCurrentUserId(): number | null {
    const decoded = this.getDecodedToken();
    return decoded ? parseInt(decoded.nameid) : null;
  }

  /**
   * Returnează username-ul utilizatorului din token.
   */
  getCurrentUsername(): string {
    const decoded = this.getDecodedToken();
    const username = decoded == null ? '' : decoded.sub;
    return username;
  }

  /**
   * Returnează email-ul utilizatorului din token.
   */
  getCurrentUserEmail(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.email ?? null;
  }

  /**
   * Verifică dacă token-ul este expirat.
   */
  isTokenExpired(): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded) return true;

    const currentTime = Math.floor(Date.now() / 1000); // Timp curent în secunde
    return decoded.exp < currentTime;
  }

}