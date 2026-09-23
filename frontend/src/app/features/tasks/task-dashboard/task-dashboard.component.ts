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
import { translateMessage } from '../../../core/interceptors/error.interceptor';

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

        <div class="techx-glass rounded-2xl p-4 border border-white/10 flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
          <div class="flex flex-col sm:flex-row gap-3 flex-1">
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              (keyup.enter)="applyFilters()"
              placeholder="Buscar por título ou descrição..." 
              class="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#FBB03B] text-sm"
            />

            <div class="flex items-center space-x-2">
              <button 
                *ngFor="let status of filterOptions" 
                (click)="setStatusFilter(status)"
                [ngClass]="getFilterBtnClass(status)"
                class="px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border border-white/10 cursor-pointer">
                {{ getStatusLabel(status) }}
              </button>
            </div>
          </div>

          <div class="flex items-center space-x-2 self-end lg:self-auto">
            <button 
              (click)="applyFilters()"
              class="techx-btn-pill px-5 py-2.5 text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-[#DC8016]/20 cursor-pointer">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <span>Aplicar Filtros</span>
            </button>

            <button 
              (click)="clearFilters()"
              class="px-4 py-2.5 rounded-full text-xs font-semibold border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer flex items-center space-x-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <span>Limpar Filtros</span>
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
        [errorMessage]="modalError()"
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
  modalError = signal<string | null>(null);

  totalTasks = computed(() => this.taskService.tasks().length);
  completedTasks = computed(() => this.taskService.tasks().filter(t => t.isCompleted).length);
  pendingTasks = computed(() => this.totalTasks() - this.completedTasks());
  completionRate = computed(() => this.totalTasks() > 0 ? Math.round((this.completedTasks() / this.totalTasks()) * 100) : 0);

  ngOnInit(): void {
    this.taskService.loadTasks();
  }

  applyFilters(): void {
    this.taskService.loadTasks({ search: this.searchQuery, isCompleted: this.statusFilter() });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.statusFilter.set('ALL');
    this.applyFilters();
  }

  setStatusFilter(status: string): void {
    this.statusFilter.set(status);
    this.applyFilters();
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
    });
  }

  onDeleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe(() => {
      this.toastService.showSuccess('Tarefa Excluída', 'A tarefa foi removida com sucesso.');
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
        },
        error: (err) => {
          const msg = translateMessage(err?.error?.message);
          this.modalError.set(msg);
        }
      });
    }
  }
}
