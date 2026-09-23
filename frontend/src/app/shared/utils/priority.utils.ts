import { TaskPriority } from '../../core/models/task.model';

export function getPriorityLabel(priority: TaskPriority): string {
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

export function getPriorityBadgeClass(priority: TaskPriority): string {
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
