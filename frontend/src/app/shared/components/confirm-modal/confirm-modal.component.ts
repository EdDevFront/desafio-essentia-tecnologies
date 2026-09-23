import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div class="w-full max-w-md techx-glass rounded-2xl p-6 border border-white/10 shadow-2xl space-y-5 relative overflow-hidden text-center">
        <div class="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto shadow-inner">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </div>

        <div class="space-y-2">
          <h3 class="text-xl font-bold text-white tracking-tight">{{ title }}</h3>
          <p class="text-sm text-[#b1bbb1] leading-relaxed">
            {{ message }}
          </p>
        </div>

        <div class="flex items-center justify-center space-x-3 pt-3 border-t border-white/10">
          <button 
            (click)="onCancel.emit()" 
            class="px-5 py-2.5 rounded-full text-sm font-semibold border border-white/10 text-slate-300 hover:bg-white/5 cursor-pointer transition-colors">
            Cancelar
          </button>

          <button 
            (click)="onConfirm.emit()" 
            class="px-6 py-2.5 rounded-full text-sm font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25 cursor-pointer transition-all">
            Sim, Excluir
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmModalComponent {
  @Input({ required: true }) title: string = 'Confirmar Exclusão';
  @Input({ required: true }) message: string = 'Tem certeza que deseja realizar esta ação?';
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
}
