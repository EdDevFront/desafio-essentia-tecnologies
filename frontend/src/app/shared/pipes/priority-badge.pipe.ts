import { Pipe, PipeTransform } from '@angular/core';
import { TaskPriority } from '../../core/models/task.model';
import { getPriorityBadgeClass } from '../utils/priority.utils';

@Pipe({
  name: 'priorityBadgeClass',
  standalone: true
})
export class PriorityBadgePipe implements PipeTransform {
  transform(priority: TaskPriority): string {
    return getPriorityBadgeClass(priority);
  }
}
