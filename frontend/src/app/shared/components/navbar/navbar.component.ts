import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="sticky top-0 z-40 w-full border-b border-white/10 bg-[#050505]/80 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-[#FBB03B] to-[#DC8016] p-0.5 flex items-center justify-center shadow-lg shadow-[#DC8016]/20">
            <div class="h-full w-full bg-[#050505] rounded-[10px] flex items-center justify-center">
              <span class="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FBB03B] to-[#DC8016] text-xl">X</span>
            </div>
          </div>
          <div>
            <span class="text-xl font-bold tracking-tight text-white">Tech<span class="text-[#FBB03B]">X</span></span>
            <span class="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FBB03B]/10 text-[#FBB03B] border border-[#FBB03B]/20">TASKS</span>
          </div>
        </div>

        <div class="flex items-center space-x-4" *ngIf="authService.isAuthenticated(); else guestMenu">
          <div *ngIf="authService.isLoadingProfile() || !authService.currentUser()" class="flex items-center space-x-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 animate-pulse">
            <div class="w-7 h-7 rounded-full bg-white/20"></div>
            <div class="h-4 w-24 bg-white/20 rounded"></div>
          </div>

          <div *ngIf="!authService.isLoadingProfile() && authService.currentUser()" class="flex items-center space-x-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <div class="w-7 h-7 rounded-full bg-gradient-to-r from-[#FBB03B] to-[#DC8016] text-[#050505] flex items-center justify-center font-bold text-xs">
              {{ getInitials(authService.currentUser()?.name) }}
            </div>
            <span class="text-sm font-medium text-slate-200">{{ authService.currentUser()?.name }}</span>
          </div>

          <button 
            (click)="logout()" 
            class="techx-btn-pill px-5 py-2 text-sm font-semibold flex items-center space-x-2 transition-all cursor-pointer">
            <span>Sair</span>
          </button>
        </div>

        <ng-template #guestMenu>
          <div class="flex items-center space-x-3">
            <a routerLink="/login" class="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Entrar</a>
            <a routerLink="/register" class="techx-btn-pill px-5 py-2 text-sm font-semibold">Cadastrar</a>
          </div>
        </ng-template>
      </div>
    </header>
  `
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService);
  private router = inject(Router);

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
