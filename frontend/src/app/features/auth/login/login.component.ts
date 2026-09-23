import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-[#050505] text-white">
      <app-navbar></app-navbar>

      <main class="flex-1 flex items-center justify-center p-4 py-12">
        <div class="w-full max-w-md techx-glass rounded-2xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-[#DC8016]/20 rounded-full blur-3xl pointer-events-none"></div>

          <div class="text-center mb-8">
            <h1 class="text-2xl font-bold tracking-tight">Acessar a Plataforma</h1>
            <p class="text-sm text-[#b1bbb1] mt-2">Entre com suas credenciais para gerenciar suas tarefas TechX</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-[#b1bbb1] mb-2">E-mail</label>
              <input 
                type="email" 
                formControlName="email" 
                placeholder="seu.email@techx.com"
                class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#FBB03B] transition-colors"
              />
              <p *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.invalid" class="text-xs text-red-400 mt-1">
                E-mail inválido.
              </p>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-[#b1bbb1] mb-2">Senha</label>
              <input 
                type="password" 
                formControlName="password" 
                placeholder="••••••••"
                class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#FBB03B] transition-colors"
              />
              <p *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.invalid" class="text-xs text-red-400 mt-1">
                A senha é obrigatória.
              </p>
            </div>

            <button 
              type="submit" 
              [disabled]="loginForm.invalid || isLoading()"
              class="w-full techx-btn-pill py-3 text-base font-bold shadow-lg shadow-[#DC8016]/20 disabled:opacity-50 cursor-pointer">
              <span *ngIf="!isLoading()">Entrar na Conta</span>
              <span *ngIf="isLoading()">Carregando...</span>
            </button>
          </form>

          <p class="text-center text-sm text-[#b1bbb1] mt-8">
            Ainda não tem uma conta? 
            <a routerLink="/register" class="text-[#FBB03B] hover:underline font-medium">Cadastre-se</a>
          </p>
        </div>
      </main>

      <app-footer></app-footer>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  isLoading = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.isLoading.set(true);

    const { email, password } = this.loginForm.value;
    this.authService.login({ email: email!, password: password! }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toastService.showSuccess('Bem-vindo!', 'Login realizado com sucesso.');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}
