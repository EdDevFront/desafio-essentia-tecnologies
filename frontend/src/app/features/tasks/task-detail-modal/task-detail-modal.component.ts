import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskPriority } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      (click)="onClose.emit()"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      
      <div 
        (click)="$event.stopPropagation()"
        class="w-full max-w-lg bg-[#161b22] rounded-2xl p-6 border border-white/20 shadow-2xl space-y-5 relative select-none">
        
        <div class="flex items-start justify-between border-b border-white/10 pb-4">
          <div class="space-y-2 flex-1 pr-4">
            <div class="flex items-center space-x-2.5">
              <span 
                class="px-2.5 py-0.5 text-[11px] font-bold rounded-full border uppercase tracking-wider"
                [ngClass]="getPriorityBadgeClass(task.priority)">
                {{ getPriorityLabel(task.priority) }}
              </span>
              <span 
                class="px-2.5 py-0.5 text-[11px] font-bold rounded-full border uppercase tracking-wider"
                [ngClass]="task.isCompleted ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'">
                {{ task.isCompleted ? 'Concluída' : 'Pendente' }}
              </span>
            </div>
            <h2 class="text-xl font-bold text-white leading-snug">
              {{ task.title }}
            </h2>
          </div>

          <button 
            (click)="onClose.emit()" 
            class="text-slate-400 hover:text-white p-1 cursor-pointer transition-colors rounded-lg hover:bg-white/10">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="space-y-4 text-sm">
          <div>
            <span class="block text-xs font-semibold uppercase tracking-wider text-[#b1bbb1] mb-1.5">Descrição</span>
            <div class="p-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 leading-relaxed whitespace-pre-wrap">
              <span *ngIf="task.description; else noDesc">{{ task.description }}</span>
              <ng-template #noDesc>
                <span class="text-white/40 italic">Sem descrição informada para esta tarefa.</span>
              </ng-template>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="block text-xs font-semibold uppercase tracking-wider text-[#b1bbb1] mb-1.5">Categoria</span>
              <div class="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs font-medium">
                {{ task.category || 'Geral' }}
              </div>
            </div>

            <div>
              <span class="block text-xs font-semibold uppercase tracking-wider text-[#b1bbb1] mb-1.5">Data de Entrega</span>
              <div class="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs font-medium flex items-center space-x-1.5">
                <svg class="w-3.5 h-3.5 text-[#FBB03B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span>{{ task.dueDate ? (task.dueDate | date:'dd/MM/yyyy') : 'Não definida' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-white/10">
          <div class="flex items-center space-x-2">
            <button 
              (click)="onEdit.emit(task)" 
              class="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 hover:text-white cursor-pointer transition-colors">
              Editar
            </button>
            <button 
              (click)="onDelete.emit(task.id)" 
              class="px-4 py-2 rounded-xl text-xs font-semibold bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 cursor-pointer transition-colors">
              Excluir
            </button>
          </div>

          <button 
            (click)="onClose.emit()" 
            class="techx-btn-pill px-5 py-2 text-xs font-bold shadow-md shadow-[#DC8016]/20 cursor-pointer">
            Fechar
          </button>
        </div>
      </div>
    </div>
  `
})
export class TaskDetailModalComponent {
  @Input({ required: true }) task!: Task;
  @Output() onClose = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<Task>();
  @Output() onDelete = new EventEmitter<string>();

  getPriorityLabel(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.URGENT:
        return 'Urgente';
      case TaskPriority.HIGH:
        return 'Alta';
      case TaskPriority.MEDIUM:
        return 'Média';
      case TaskPriority.LOW:
        return 'Baixa';
      default:
        return priority || 'Média';
    }
  }

  getPriorityBadgeClass(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.URGENT:
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case TaskPriority.HIGH:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case TaskPriority.MEDIUM:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  }
}
