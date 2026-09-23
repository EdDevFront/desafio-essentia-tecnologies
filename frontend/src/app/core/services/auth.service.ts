import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  currentUser = signal<User | null>(null);
  token = signal<string | null>(localStorage.getItem('techx_token'));
  isLoadingProfile = signal<boolean>(false);
  isAuthenticated = computed(() => !!this.token());

  constructor(private http: HttpClient) {
    if (this.token()) {
      this.fetchProfile();
    }
  }

  fetchProfile(): void {
    this.isLoadingProfile.set(true);
    this.http.get<User>(`${this.apiUrl}/me`).subscribe({
      next: (user) => {
        this.currentUser.set(user);
        this.isLoadingProfile.set(false);
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          this.logout();
        }
        this.isLoadingProfile.set(false);
      }
    });
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  logout(): void {
    localStorage.removeItem('techx_token');
    localStorage.removeItem('techx_user');
    this.currentUser.set(null);
    this.token.set(null);
  }

  private handleAuthSuccess(res: AuthResponse): void {
    localStorage.setItem('techx_token', res.accessToken);
    this.token.set(res.accessToken);
    this.currentUser.set(res.user);
  }
}
