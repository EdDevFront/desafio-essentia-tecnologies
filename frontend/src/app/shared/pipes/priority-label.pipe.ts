import { Pipe, PipeTransform } from '@angular/core';
import { TaskPriority } from '../../core/models/task.model';
import { getPriorityLabel } from '../utils/priority.utils';

@Pipe({
  name: 'priorityLabel',
  standalone: true
})
export class PriorityLabelPipe implements PipeTransform {
  transform(priority: TaskPriority): string {
    return getPriorityLabel(priority);
  }
}
