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

        <div class="techx-glass rounded-2xl p-4 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex flex-col sm:flex-row gap-4 flex-1 sm:items-center">
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              (keyup.enter)="applyFilters()"
              placeholder="Buscar por título ou descrição..." 
              class="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#FBB03B] text-sm"
            />

            <div class="flex items-center space-x-3 shrink-0">
              <span class="text-xs font-semibold uppercase text-[#b1bbb1] mr-1">Status:</span>
              <label class="inline-flex items-center space-x-1 text-xs font-medium cursor-pointer text-slate-300 hover:text-white">
                <input type="radio" name="statusFilterRadio" value="ALL" [(ngModel)]="statusFilter" class="accent-[#FBB03B] w-3.5 h-3.5 cursor-pointer" />
                <span>Todas</span>
              </label>
              <label class="inline-flex items-center space-x-1 text-xs font-medium cursor-pointer text-slate-300 hover:text-white">
                <input type="radio" name="statusFilterRadio" value="false" [(ngModel)]="statusFilter" class="accent-[#FBB03B] w-3.5 h-3.5 cursor-pointer" />
                <span>Pendentes</span>
              </label>
              <label class="inline-flex items-center space-x-1 text-xs font-medium cursor-pointer text-slate-300 hover:text-white">
                <input type="radio" name="statusFilterRadio" value="true" [(ngModel)]="statusFilter" class="accent-[#FBB03B] w-3.5 h-3.5 cursor-pointer" />
                <span>Concluídas</span>
              </label>
            </div>
          </div>

          <div class="flex items-center space-x-3 self-end md:self-auto shrink-0">
            <button 
              *ngIf="isFilterApplied()" 
              (click)="clearFilters()" 
              class="text-xs text-[#FBB03B] hover:underline font-semibold cursor-pointer px-2 py-1 transition-colors">
              Limpar Filtros
            </button>

            <button 
              (click)="applyFilters()"
              class="techx-btn-pill px-5 py-2.5 text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-[#DC8016]/20 cursor-pointer">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <span>Aplicar Filtros</span>
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
  statusFilter = 'ALL';
  
  isFilterApplied = signal<boolean>(false);
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
    const isApplied = this.searchQuery.trim() !== '' || this.statusFilter !== 'ALL';
    this.isFilterApplied.set(isApplied);
    this.taskService.loadTasks({ search: this.searchQuery.trim(), isCompleted: this.statusFilter });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.statusFilter = 'ALL';
    this.isFilterApplied.set(false);
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
      this.applyFilters();
    });
  }

  onDeleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe(() => {
      this.toastService.showSuccess('Tarefa Excluída', 'A tarefa foi removida com sucesso.');
      this.applyFilters();
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
          this.applyFilters();
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
          this.applyFilters();
        },
        error: (err) => {
          const msg = translateMessage(err?.error?.message);
          this.modalError.set(msg);
        }
      });
    }
  }
}
