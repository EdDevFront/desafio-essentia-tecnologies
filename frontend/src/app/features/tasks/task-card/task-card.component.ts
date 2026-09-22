import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskPriority } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="techx-glass techx-glass-hover rounded-2xl p-5 border border-white/10 flex flex-col justify-between space-y-4 group">
      
      <div class="flex items-start justify-between space-x-3">
        <div class="flex items-start space-x-3 flex-1">
          <button 
            (click)="onToggle.emit(task.id)"
            class="mt-1 h-6 w-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer"
            [ngClass]="task.isCompleted ? 'bg-[#10B981] border-[#10B981] text-[#050505]' : 'border-white/20 hover:border-[#FBB03B] bg-white/5'">
            <svg *ngIf="task.isCompleted" class="w-4 h-4 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
            </svg>
          </button>

          <div class="flex-1">
            <h3 
              class="text-base font-semibold tracking-tight transition-colors"
              [ngClass]="task.isCompleted ? 'line-through text-[#b1bbb1]' : 'text-white group-hover:text-[#FBB03B]'">
              {{ task.title }}
            </h3>
            <p *ngIf="task.description" class="text-sm text-[#b1bbb1] mt-1 line-clamp-2">
              {{ task.description }}
            </p>
          </div>
        </div>

        <span 
          class="px-2.5 py-1 text-xs font-bold rounded-full border uppercase tracking-wider"
          [ngClass]="getPriorityBadgeClass(task.priority)">
          {{ task.priority }}
        </span>
      </div>

      <div class="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#b1bbb1]">
        <div class="flex items-center space-x-2">
          <span *ngIf="task.category" class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
            {{ task.category }}
          </span>
          <span *ngIf="task.dueDate" class="flex items-center space-x-1">
            <span>📅 {{ task.dueDate | date:'dd/MM/yyyy' }}</span>
          </span>
        </div>

        <div class="flex items-center space-x-2 opacity-80 group-hover:opacity-100 transition-opacity">
          <button 
            (click)="onEdit.emit(task)"
            class="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer">
            ✏️
          </button>
          <button 
            (click)="onDelete.emit(task.id)"
            class="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer">
            🗑️
          </button>
        </div>
      </div>
    </div>
  `
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Output() onToggle = new EventEmitter<string>();
  @Output() onEdit = new EventEmitter<Task>();
  @Output() onDelete = new EventEmitter<string>();

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
