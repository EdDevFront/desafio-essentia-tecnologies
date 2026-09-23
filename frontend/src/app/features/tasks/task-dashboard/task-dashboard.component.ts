import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../core/services/task.service';
import { ToastService } from '../../../core/services/toast.service';
import { Task } from '../../../core/models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskFormModalComponent } from '../task-form-modal/task-form-modal.component';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { LoadingSkeletonComponent } from '../../../shared/components/loading-skeleton/loading-skeleton.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-task-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    TaskCardComponent, 
    TaskFormModalComponent, 
    NavbarComponent, 
    FooterComponent,
    LoadingSkeletonComponent,
    EmptyStateComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-[#050505] text-white">
      <app-navbar></app-navbar>

      <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 class="text-3xl font-extrabold tracking-tight">Painel de <span class="text-[#FBB03B]">Tarefas</span></h1>
            <p class="text-sm text-[#b1bbb1] mt-1">Organize suas demandas com alta performance e simplicidade.</p>
          </div>

          <button 
            (click)="openCreateModal()" 
            class="techx-btn-pill px-6 py-3 text-sm font-bold flex items-center space-x-2 shadow-lg shadow-[#DC8016]/20 self-start md:self-auto cursor-pointer">
            <span>+ Nova Tarefa</span>
          </button>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="techx-glass rounded-2xl p-4 border border-white/10">
            <span class="text-xs text-[#b1bbb1] font-semibold uppercase">Total</span>
            <p class="text-2xl font-bold mt-1">{{ totalTasks() }}</p>
          </div>
          <div class="techx-glass rounded-2xl p-4 border border-white/10">
            <span class="text-xs text-amber-400 font-semibold uppercase">Pendente</span>
            <p class="text-2xl font-bold mt-1 text-amber-400">{{ pendingTasks() }}</p>
          </div>
          <div class="techx-glass rounded-2xl p-4 border border-white/10">
            <span class="text-xs text-[#10B981] font-semibold uppercase">Concluído</span>
            <p class="text-2xl font-bold mt-1 text-[#10B981]">{{ completedTasks() }}</p>
          </div>
          <div class="techx-glass rounded-2xl p-4 border border-white/10">
            <span class="text-xs text-cyan-400 font-semibold uppercase">Taxa</span>
            <p class="text-2xl font-bold mt-1 text-cyan-400">{{ completionRate() }}%</p>
          </div>
        </div>

        <div class="techx-glass rounded-2xl p-4 border border-white/10 flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (ngModelChange)="onFilterChange()"
            placeholder="Buscar por título ou descrição..." 
            class="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#FBB03B] text-sm"
          />

          <div class="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
            <button 
              *ngFor="let status of filterOptions" 
              (click)="setStatusFilter(status)"
              [ngClass]="getFilterBtnClass(status)"
              class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border border-white/10 cursor-pointer">
              {{ getStatusLabel(status) }}
            </button>
          </div>
        </div>

        <app-loading-skeleton *ngIf="taskService.isLoading()"></app-loading-skeleton>

        <app-empty-state 
          *ngIf="!taskService.isLoading() && taskService.tasks().length === 0"
          [title]="'Nenhuma tarefa por aqui!'"
          [description]="'Crie sua primeira tarefa para manter sua produtividade em dia.'"
          [actionLabel]="'+ Criar Tarefa'"
          (onAction)="openCreateModal()">
        </app-empty-state>

        <div *ngIf="!taskService.isLoading() && taskService.tasks().length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <app-task-card 
            *ngFor="let task of taskService.tasks()" 
            [task]="task"
            (onToggle)="onToggleTask($event)"
            (onEdit)="openEditModal($event)"
            (onDelete)="onDeleteTask($event)">
          </app-task-card>
        </div>
      </main>

      <app-task-form-modal 
        *ngIf="isModalOpen()" 
        [taskToEdit]="selectedTask()"
        (onClose)="closeModal()"
        (onSave)="onSaveTask($event)">
      </app-task-form-modal>

      <app-footer></app-footer>
    </div>
  `
})
export class TaskDashboardComponent implements OnInit {
  taskService = inject(TaskService);
  private toastService = inject(ToastService);

  searchQuery = '';
  statusFilter = signal<string>('ALL');
  filterOptions = ['ALL', 'false', 'true'];
  isModalOpen = signal<boolean>(false);
  selectedTask = signal<Task | null>(null);

  totalTasks = computed(() => this.taskService.tasks().length);
  completedTasks = computed(() => this.taskService.tasks().filter(t => t.isCompleted).length);
  pendingTasks = computed(() => this.totalTasks() - this.completedTasks());
  completionRate = computed(() => this.totalTasks() > 0 ? Math.round((this.completedTasks() / this.totalTasks()) * 100) : 0);

  ngOnInit(): void {
    this.taskService.loadTasks();
  }

  onFilterChange(): void {
    this.taskService.loadTasks({ search: this.searchQuery, isCompleted: this.statusFilter() });
  }

  setStatusFilter(status: string): void {
    this.statusFilter.set(status);
    this.onFilterChange();
  }

  getFilterBtnClass(status: string): string {
    return this.statusFilter() === status
      ? 'bg-[#FBB03B] text-[#050505]'
      : 'bg-white/5 text-[#b1bbb1] hover:bg-white/10';
  }

  getStatusLabel(status: string): string {
    if (status === 'ALL') return 'Todas';
    if (status === 'false') return 'Pendentes';
    return 'Concluídas';
  }

  openCreateModal(): void {
    this.selectedTask.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(task: Task): void {
    this.selectedTask.set(task);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedTask.set(null);
  }

  onToggleTask(id: string): void {
    this.taskService.toggleComplete(id).subscribe(() => {
      this.toastService.showSuccess('Status Atualizado', 'O status da tarefa foi alterado.');
    });
  }

  onDeleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe(() => {
      this.toastService.showSuccess('Tarefa Excluída', 'A tarefa foi removida com sucesso.');
    });
  }

  onSaveTask(payload: any): void {
    const task = this.selectedTask();
    if (task) {
      this.taskService.updateTask(task.id, payload).subscribe(() => {
        this.toastService.showSuccess('Tarefa Atualizada', 'As alterações foram salvas com sucesso.');
        this.closeModal();
      });
    } else {
      this.taskService.createTask(payload).subscribe(() => {
        this.toastService.showSuccess('Tarefa Criada', 'A nova tarefa foi adicionada com sucesso.');
        this.closeModal();
      });
    }
  }
}
