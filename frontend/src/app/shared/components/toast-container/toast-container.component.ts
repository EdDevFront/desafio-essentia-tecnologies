import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-container.component.html'
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
