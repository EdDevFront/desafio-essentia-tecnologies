import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  isAuthenticated = computed(() => this.authService.isAuthenticated());
  isLoadingProfile = computed(() => this.authService.isLoadingProfile() || !this.authService.currentUser());
  isProfileLoaded = computed(() => !this.authService.isLoadingProfile() && !!this.authService.currentUser());
  currentUser = computed(() => this.authService.currentUser());
  userInitials = computed(() => this.getInitials(this.currentUser()?.name));

  ngOnInit(): void {
    if (this.authService.token() && !this.authService.currentUser() && !this.authService.isLoadingProfile()) {
      this.authService.fetchProfile();
    }
  }

  getInitials(name?: string): string {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
