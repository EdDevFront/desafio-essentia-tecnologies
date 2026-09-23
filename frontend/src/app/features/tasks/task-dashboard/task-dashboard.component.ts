import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../core/services/task.service';
import { ToastService } from '../../../core/services/toast.service';
import { Task } from '../../../core/models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskFormModalComponent } from '../task-form-modal/task-form-modal.component';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { LoadingSkeletonComponent } from '../../../shared/components/loading-skeleton/loading-skeleton.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { TaskDetailModalComponent } from '../task-detail-modal/task-detail-modal.component';
import { translateMessage } from '../../../core/interceptors/error.interceptor';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { TaskStatsComponent } from '../task-stats/task-stats.component';
import { TaskFilterComponent, TaskFilterValues } from '../task-filter/task-filter.component';

@Component({
  selector: 'app-task-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    TaskCardComponent, 
    TaskFormModalComponent, 
    TaskDetailModalComponent,
    ConfirmModalComponent,
    NavbarComponent, 
    FooterComponent,
    LoadingSkeletonComponent,
    EmptyStateComponent,
    ButtonComponent,
    TaskStatsComponent,
    TaskFilterComponent
  ],
  templateUrl: './task-dashboard.component.html'
})
export class TaskDashboardComponent implements OnInit {
  taskService = inject(TaskService);
  private toastService = inject(ToastService);
  
  private lastAppliedFilters: TaskFilterValues = {};

  isModalOpen = signal<boolean>(false);
  selectedTask = signal<Task | null>(null);
  taskToView = signal<Task | null>(null);
  taskToDelete = signal<Task | null>(null);
  modalError = signal<string | null>(null);

  totalTasks = computed(() => this.taskService.tasks().length);
  completedTasks = computed(() => this.taskService.tasks().filter(t => t.isCompleted).length);
  pendingTasks = computed(() => this.totalTasks() - this.completedTasks());
  completionRate = computed(() => this.totalTasks() > 0 ? Math.round((this.completedTasks() / this.totalTasks()) * 100) : 0);

  ngOnInit(): void {
    this.taskService.loadTasks();
  }

  onFilterTasks(filters: TaskFilterValues): void {
    this.lastAppliedFilters = filters;
    this.taskService.loadTasks(this.lastAppliedFilters);
  }

  onClearFilters(): void {
    this.lastAppliedFilters = {};
    this.taskService.loadTasks();
  }

  openCreateModal(): void {
    this.selectedTask.set(null);
    this.modalError.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(task: Task): void {
    this.selectedTask.set(task);
    this.modalError.set(null);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedTask.set(null);
    this.modalError.set(null);
  }

  onToggleTask(id: string): void {
    const task = this.taskService.tasks().find(t => t.id === id);
    const targetStatus = task?.isCompleted ? 'Pendente' : 'Concluída';

    this.taskService.toggleComplete(id).subscribe(() => {
      this.toastService.showSuccess(
        'Status Atualizado', 
        `A tarefa foi marcada como "${targetStatus}".`
      );
      this.onClearFilters();
    });
  }

  promptDeleteTask(id: string): void {
    const task = this.taskService.tasks().find(t => t.id === id);
    if (task) {
      this.taskToDelete.set(task);
    }
  }

  confirmDeleteTask(): void {
    const task = this.taskToDelete();
    if (!task) return;

    this.taskService.deleteTask(task.id).subscribe(() => {
      this.toastService.showSuccess('Tarefa Excluída', 'A tarefa foi removida com sucesso.');
      this.taskToDelete.set(null);
      this.onClearFilters();
    });
  }

  onSaveTask(payload: any): void {
    this.modalError.set(null);
    const task = this.selectedTask();
    if (task) {
      this.taskService.updateTask(task.id, payload).subscribe({
        next: () => {
          this.toastService.showSuccess('Tarefa Atualizada', 'As alterações foram salvas com sucesso.');
          this.closeModal();
          this.onClearFilters();
        },
        error: (err) => {
          const msg = translateMessage(err?.error?.message);
          this.modalError.set(msg);
        }
      });
    } else {
      this.taskService.createTask(payload).subscribe({
        next: () => {
          this.toastService.showSuccess('Tarefa Criada', 'A nova tarefa foi adicionada com sucesso.');
          this.closeModal();
          this.onClearFilters();
        },
        error: (err) => {
          const msg = translateMessage(err?.error?.message);
          this.modalError.set(msg);
        }
      });
    }
  }
}
