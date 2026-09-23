import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-24 left-1/2 transform -translate-x-1/2 z-[9999] flex flex-col items-center space-y-3 max-w-md w-full px-4 pointer-events-none">
      <div 
        *ngFor="let toast of toastService.toasts()" 
        class="pointer-events-auto rounded-2xl p-4 border shadow-2xl backdrop-blur-xl flex items-start space-x-3 transition-all transform duration-300 w-full"
        [ngClass]="getToastStyles(toast.type)">
        
        <div class="p-1.5 rounded-xl flex items-center justify-center shrink-0" [ngClass]="getIconBadgeStyle(toast.type)">
          <svg *ngIf="toast.type === 'success'" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
          </svg>
          <svg *ngIf="toast.type === 'error'" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <svg *ngIf="toast.type === 'info'" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>

        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-bold text-white tracking-tight">{{ toast.title }}</h4>
          <p class="text-xs text-white/90 mt-0.5 font-medium leading-relaxed">{{ toast.message }}</p>
        </div>

        <button 
          (click)="toastService.remove(toast.id)" 
          class="text-white/70 hover:text-white p-1 cursor-pointer transition-colors rounded-lg hover:bg-white/10 shrink-0">
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

  getToastStyles(type: 'success' | 'error' | 'info'): string {
    switch (type) {
      case 'success':
        return 'bg-[#064e3b]/95 border-[#10B981] shadow-[#10B981]/20 text-white';
      case 'error':
        return 'bg-[#7f1d1d]/95 border-red-500 shadow-red-500/20 text-white';
      default:
        return 'bg-[#78350f]/95 border-[#FBB03B] shadow-[#FBB03B]/20 text-white';
    }
  }

  getIconBadgeStyle(type: 'success' | 'error' | 'info'): string {
    switch (type) {
      case 'success':
        return 'bg-[#10B981]';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-[#FBB03B]';
    }
  }
}
