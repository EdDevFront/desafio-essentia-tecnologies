import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { Task } from '../../../core/models/task.model';
import { PriorityLabelPipe } from '../../../shared/pipes/priority-label.pipe';
import { PriorityBadgePipe } from '../../../shared/pipes/priority-badge.pipe';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-task-detail-modal',
  standalone: true,
  imports: [CommonModule, PriorityLabelPipe, PriorityBadgePipe, ModalComponent, ButtonComponent],
  templateUrl: './task-detail-modal.component.html'
})
export class TaskDetailModalComponent {
  @Input({ required: true }) task!: Task;
  @Output() onClose = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<Task>();
  @Output() onDelete = new EventEmitter<string>();

  get statusLabel(): string {
    return this.task.isCompleted ? 'Concluída' : 'Pendente';
  }

  get statusBadgeClass(): string {
    return this.task.isCompleted 
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
      : 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  }

  get categoryLabel(): string {
    return this.task.category || 'Geral';
  }

  get dueDateLabel(): string {
    if (!this.task.dueDate) {
      return 'Não definida';
    }
    try {
      return formatDate(this.task.dueDate, 'dd/MM/yyyy', 'en-US');
    } catch {
      return 'Não definida';
    }
  }
}
