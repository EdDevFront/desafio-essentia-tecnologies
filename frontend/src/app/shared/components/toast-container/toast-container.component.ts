import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center space-y-3 max-w-md w-full px-4 pointer-events-none">
      <div 
        *ngFor="let toast of toastService.toasts()" 
        class="pointer-events-auto techx-glass rounded-xl p-4 border shadow-2xl flex items-start space-x-3 transition-all transform duration-300 w-full"
        [ngClass]="getToastBorderClass(toast.type)">
        
        <div class="mt-0.5">
          <svg *ngIf="toast.type === 'success'" class="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <svg *ngIf="toast.type === 'error'" class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <svg *ngIf="toast.type === 'info'" class="w-5 h-5 text-[#FBB03B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>

        <div class="flex-1">
          <h4 class="text-sm font-bold text-white">{{ toast.title }}</h4>
          <p class="text-xs text-[#b1bbb1] mt-0.5">{{ toast.message }}</p>
        </div>

        <button 
          (click)="toastService.remove(toast.id)" 
          class="text-slate-400 hover:text-white p-1 cursor-pointer transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  `
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  getToastBorderClass(type: 'success' | 'error' | 'info'): string {
    switch (type) {
      case 'success':
        return 'border-[#10B981]/40 bg-[#10B981]/10';
      case 'error':
        return 'border-red-500/40 bg-red-500/10';
      default:
        return 'border-[#FBB03B]/40 bg-[#FBB03B]/10';
    }
  }
}
