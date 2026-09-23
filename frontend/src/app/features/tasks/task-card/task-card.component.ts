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

  get toggleButtonClass(): string {
    return this.task.isCompleted 
      ? 'bg-[#10B981] border-[#10B981] text-[#050505]' 
      : 'border-white/20 hover:border-[#FBB03B] bg-white/5';
  }

  get titleClass(): string {
    return this.task.isCompleted 
      ? 'line-through text-[#b1bbb1]' 
      : 'text-white group-hover:text-[#FBB03B]';
  }

  get descriptionClass(): string {
    return this.task.description 
      ? 'text-[#b1bbb1]' 
      : 'text-white/30 italic';
  }
}
