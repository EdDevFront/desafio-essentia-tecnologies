import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskPriority } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div class="w-full max-w-lg techx-glass rounded-2xl p-6 border border-white/10 shadow-2xl space-y-6 relative overflow-hidden">
        <div class="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 class="text-xl font-bold text-white">
            {{ taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa' }}
          </h2>
          <button (click)="onClose.emit()" class="text-slate-400 hover:text-white text-xl cursor-pointer">✕</button>
        </div>

        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#b1bbb1] mb-2">Título *</label>
            <input 
              type="text" 
              formControlName="title" 
              placeholder="Ex: Implementar testes unitários"
              class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#FBB03B] transition-colors"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#b1bbb1] mb-2">Descrição</label>
            <textarea 
              formControlName="description" 
              rows="3" 
              placeholder="Detalhes adicionais da tarefa..."
              class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#FBB03B] transition-colors resize-none">
            </textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-[#b1bbb1] mb-2">Prioridade</label>
              <select 
                formControlName="priority" 
                class="w-full px-4 py-3 rounded-xl bg-[#0d1117] border border-white/10 text-white focus:outline-none focus:border-[#FBB03B]">
                <option [value]="TaskPriority.LOW">Baixa</option>
                <option [value]="TaskPriority.MEDIUM">Média</option>
                <option [value]="TaskPriority.HIGH">Alta</option>
                <option [value]="TaskPriority.URGENT">Urgente</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-[#b1bbb1] mb-2">Categoria</label>
              <input 
                type="text" 
                formControlName="category" 
                placeholder="Ex: Backend"
                class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#FBB03B]"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#b1bbb1] mb-2">Data de Entrega</label>
            <input 
              type="date" 
              formControlName="dueDate" 
              class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FBB03B]"
            />
          </div>

          <div class="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
            <button 
              type="button" 
              (click)="onClose.emit()" 
              class="px-5 py-2.5 rounded-full text-sm font-semibold border border-white/10 text-slate-300 hover:bg-white/5 cursor-pointer">
              Cancelar
            </button>
            <button 
              type="submit" 
              [disabled]="taskForm.invalid"
              class="techx-btn-pill px-6 py-2.5 text-sm font-bold shadow-lg shadow-[#DC8016]/20 disabled:opacity-50 cursor-pointer">
              {{ taskToEdit ? 'Salvar Alterações' : 'Criar Tarefa' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class TaskFormModalComponent implements OnInit {
  @Input() taskToEdit: Task | null = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<any>();

  private fb = inject(FormBuilder);
  TaskPriority = TaskPriority;

  taskForm = this.fb.group({
    title: ['', [Validators.required]],
    description: [''],
    priority: [TaskPriority.MEDIUM],
    category: [''],
    dueDate: ['']
  });

  ngOnInit(): void {
    if (this.taskToEdit) {
      this.taskForm.patchValue({
        title: this.taskToEdit.title,
        description: this.taskToEdit.description || '',
        priority: this.taskToEdit.priority,
        category: this.taskToEdit.category || '',
        dueDate: this.taskToEdit.dueDate ? this.taskToEdit.dueDate.substring(0, 10) : ''
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid) return;
    this.onSave.emit(this.taskForm.value);
  }
}
