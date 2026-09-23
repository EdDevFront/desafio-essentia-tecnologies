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
  selector: 'app-register',
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
  templateUrl: './register.component.html'
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

  isFieldError(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.touched && control.invalid);
  }

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
