import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../core/models/task.model';
import { PriorityLabelPipe } from '../../../shared/pipes/priority-label.pipe';
import { PriorityBadgePipe } from '../../../shared/pipes/priority-badge.pipe';

@Component({
  selector: 'app-task-detail-modal',
  standalone: true,
  imports: [CommonModule, PriorityLabelPipe, PriorityBadgePipe],
  templateUrl: './task-detail-modal.component.html'
})
export class TaskDetailModalComponent {
  @Input({ required: true }) task!: Task;
  @Output() onClose = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<Task>();
  @Output() onDelete = new EventEmitter<string>();
}
