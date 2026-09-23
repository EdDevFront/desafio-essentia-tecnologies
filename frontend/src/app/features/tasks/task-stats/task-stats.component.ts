import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-stats',
  standalone: true,
  imports: [CommonModule],
  host: {
    class: 'block w-full'
  },
  templateUrl: './task-stats.component.html'
})
export class TaskStatsComponent {
  @Input() total: number = 0;
  @Input() pending: number = 0;
  @Input() completed: number = 0;
  @Input() completionRate: number = 0;
}
