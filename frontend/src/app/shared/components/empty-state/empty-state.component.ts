import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="techx-glass rounded-2xl p-12 text-center border border-white/10 flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto my-8">
      <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FBB03B]/20 to-[#DC8016]/10 flex items-center justify-center text-3xl border border-[#FBB03B]/20">
        {{ icon }}
      </div>
      <div>
        <h3 class="text-xl font-bold text-white">{{ title }}</h3>
        <p class="text-sm text-[#b1bbb1] mt-1">{{ description }}</p>
      </div>
      <button 
        *ngIf="actionLabel" 
        (click)="onAction.emit()" 
        class="techx-btn-pill px-6 py-2.5 text-sm font-bold shadow-lg shadow-[#DC8016]/20 cursor-pointer">
        {{ actionLabel }}
      </button>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() icon = '📋';
  @Input() title = 'Nenhuma tarefa encontrada';
  @Input() description = 'Você não possui tarefas cadastradas nesta visualização.';
  @Input() actionLabel?: string;
  @Output() onAction = new EventEmitter<void>();
}
