import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink, 
    NavbarComponent, 
    FooterComponent, 
    InputComponent, 
    ButtonComponent
  ],
  templateUrl: './login.component.html'
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

  isFieldError(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.touched && control.invalid);
  }

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
