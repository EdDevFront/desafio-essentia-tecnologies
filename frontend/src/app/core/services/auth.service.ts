import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  
  currentUser = signal<User | null>(this.getStoredUser());
  token = signal<string | null>(localStorage.getItem('techx_token'));
  isAuthenticated = computed(() => !!this.currentUser());

  constructor(private http: HttpClient) {}

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
    localStorage.setItem('techx_user', JSON.stringify(res.user));
    this.currentUser.set(res.user);
    this.token.set(res.accessToken);
  }

  private getStoredUser(): User | null {
    const raw = localStorage.getItem('techx_user');
    return raw ? JSON.parse(raw) : null;
  }
}
