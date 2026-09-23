import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-[#050505] text-white">
      <app-navbar></app-navbar>

      <main class="flex-1 flex items-center justify-center p-4 py-12">
        <div class="w-full max-w-md techx-glass rounded-2xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
          <div class="absolute -top-24 -left-24 w-48 h-48 bg-[#FBB03B]/20 rounded-full blur-3xl pointer-events-none"></div>

          <div class="text-center mb-8">
            <h1 class="text-2xl font-bold tracking-tight">Criar uma Nova Conta</h1>
            <p class="text-sm text-[#b1bbb1] mt-2">Cadastre-se para acessar o gerenciador de tarefas TechX</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-[#b1bbb1] mb-2">Nome Completo</label>
              <input 
                type="text" 
                formControlName="name" 
                placeholder="Ex: Edmilson Motta"
                class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#FBB03B] transition-colors"
              />
              <p *ngIf="registerForm.get('name')?.touched && registerForm.get('name')?.invalid" class="text-xs text-red-400 mt-1">
                O nome completo é obrigatório.
              </p>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-[#b1bbb1] mb-2">E-mail</label>
              <input 
                type="email" 
                formControlName="email" 
                placeholder="seu.email@techx.com"
                class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#FBB03B] transition-colors"
              />
              <p *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.invalid" class="text-xs text-red-400 mt-1">
                Informe um e-mail válido.
              </p>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-[#b1bbb1] mb-2">Senha</label>
              <input 
                type="password" 
                formControlName="password" 
                placeholder="Mínimo 6 caracteres"
                class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#FBB03B] transition-colors"
              />
              <p *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.invalid" class="text-xs text-red-400 mt-1">
                A senha deve ter no mínimo 6 caracteres.
              </p>
            </div>

            <button 
              type="submit" 
              [disabled]="registerForm.invalid || isLoading()"
              class="w-full techx-btn-pill py-3 text-base font-bold shadow-lg shadow-[#DC8016]/20 disabled:opacity-50 cursor-pointer mt-4">
              <span *ngIf="!isLoading()">Criar Conta</span>
              <span *ngIf="isLoading()">Criando conta...</span>
            </button>
          </form>

          <p class="text-center text-sm text-[#b1bbb1] mt-8">
            Já possui uma conta? 
            <a routerLink="/login" class="text-[#FBB03B] hover:underline font-medium">Faça login</a>
          </p>
        </div>
      </main>

      <app-footer></app-footer>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  isLoading = signal(false);

  registerForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);

    const { name, email, password } = this.registerForm.value;
    this.authService.register({ name: name!, email: email!, password: password! }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toastService.showSuccess('Conta criada!', 'Seu cadastro foi realizado com sucesso.');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}
