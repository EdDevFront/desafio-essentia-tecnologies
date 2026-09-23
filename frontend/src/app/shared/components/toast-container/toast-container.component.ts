import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../../core/services/toast.service';

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
        
        <div class="text-xl">
          <span *ngIf="toast.type === 'success'">✅</span>
          <span *ngIf="toast.type === 'error'">⚠️</span>
          <span *ngIf="toast.type === 'info'">ℹ️</span>
        </div>

        <div class="flex-1">
          <h4 class="text-sm font-bold text-white">{{ toast.title }}</h4>
          <p class="text-xs text-[#b1bbb1] mt-0.5">{{ toast.message }}</p>
        </div>

        <button 
          (click)="toastService.remove(toast.id)" 
          class="text-slate-400 hover:text-white text-sm cursor-pointer">
          ✕
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
