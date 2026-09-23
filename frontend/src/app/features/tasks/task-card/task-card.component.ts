import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskPriority } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  host: {
    class: 'h-full block'
  },
  templateUrl: './task-card.component.html'
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Output() onView = new EventEmitter<Task>();
  @Output() onToggle = new EventEmitter<string>();
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
