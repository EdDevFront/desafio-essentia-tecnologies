import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../core/models/task.model';
import { PriorityLabelPipe } from '../../../shared/pipes/priority-label.pipe';
import { PriorityBadgePipe } from '../../../shared/pipes/priority-badge.pipe';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, PriorityLabelPipe, PriorityBadgePipe],
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
}
