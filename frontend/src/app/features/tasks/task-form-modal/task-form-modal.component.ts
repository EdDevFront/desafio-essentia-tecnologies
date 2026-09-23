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
      <div class="w-full max-w-lg techx-glass rounded-2xl p-6 border border-white/10 shadow-2xl space-y-5 relative overflow-hidden">
        <div class="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 class="text-xl font-bold text-white">
            {{ taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa' }}
          </h2>
          <button 
            (click)="onClose.emit()" 
            class="text-slate-400 hover:text-white p-1 cursor-pointer transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div *ngIf="errorMessage" class="p-3 rounded-xl bg-[#7f1d1d]/90 border border-red-500/50 text-white text-xs flex items-center justify-center space-x-2 text-center shadow-lg">
          <svg class="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="font-medium">{{ errorMessage }}</span>
        </div>

        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#b1bbb1] mb-2">Título *</label>
            <input 
              type="text" 
              formControlName="title" 
              placeholder="Ex: Implementar testes unitários"
              class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#FBB03B] transition-colors"
            />
            <p *ngIf="taskForm.get('title')?.touched && taskForm.get('title')?.invalid" class="text-xs text-red-400 mt-1">
              O título da tarefa é obrigatório.
            </p>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#b1bbb1] mb-2">Descrição (Opcional)</label>
            <textarea 
              formControlName="description" 
              rows="2" 
              placeholder="Detalhes adicionais da tarefa..."
              class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#FBB03B] transition-colors resize-none">
            </textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-[#b1bbb1] mb-2">Prioridade *</label>
              <select 
                formControlName="priority" 
                class="w-full px-4 py-2.5 rounded-xl bg-[#0d1117] border border-white/10 text-white focus:outline-none focus:border-[#FBB03B]">
                <option [value]="TaskPriority.LOW">Baixa</option>
                <option [value]="TaskPriority.MEDIUM">Média</option>
                <option [value]="TaskPriority.HIGH">Alta</option>
                <option [value]="TaskPriority.URGENT">Urgente</option>
              </select>
              <p *ngIf="taskForm.get('priority')?.touched && taskForm.get('priority')?.invalid" class="text-xs text-red-400 mt-1">
                A prioridade é obrigatória.
              </p>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-[#b1bbb1] mb-2">Categoria *</label>
              <select 
                formControlName="categorySelect" 
                class="w-full px-4 py-2.5 rounded-xl bg-[#0d1117] border border-white/10 text-white focus:outline-none focus:border-[#FBB03B]">
                <option *ngFor="let cat of presetCategories" [value]="cat">{{ cat }}</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
          </div>

          <div *ngIf="taskForm.get('categorySelect')?.value === 'Outros'">
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#b1bbb1] mb-2">Digite a Categoria *</label>
            <input 
              type="text" 
              formControlName="customCategory" 
              placeholder="Ex: Mobile"
              class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#FBB03B]"
            />
            <p *ngIf="taskForm.get('customCategory')?.touched && isCustomCategoryInvalid()" class="text-xs text-red-400 mt-1">
              Informe o nome da categoria.
            </p>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#b1bbb1] mb-2">Data de Entrega *</label>
            <input 
              type="date" 
              formControlName="dueDate" 
              class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FBB03B]"
            />
            <p *ngIf="taskForm.get('dueDate')?.touched && taskForm.get('dueDate')?.invalid" class="text-xs text-red-400 mt-1">
              A data de entrega é obrigatória.
            </p>
          </div>

          <div class="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
            <button 
              type="button" 
              (click)="onClose.emit()" 
              class="px-5 py-2 rounded-full text-sm font-semibold border border-white/10 text-slate-300 hover:bg-white/5 cursor-pointer">
              Cancelar
            </button>
            <button 
              type="submit" 
              class="techx-btn-pill px-6 py-2 text-sm font-bold shadow-lg shadow-[#DC8016]/20 cursor-pointer">
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
  @Input() errorMessage: string | null = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<any>();

  private fb = inject(FormBuilder);
  TaskPriority = TaskPriority;

  presetCategories = [
    'Desenvolvimento',
    'Infraestrutura',
    'Design & UX',
    'Suporte & Operações',
    'Reuniões & Gestão'
  ];

  taskForm = this.fb.group({
    title: ['', [Validators.required]],
    description: [''],
    priority: [TaskPriority.MEDIUM, [Validators.required]],
    categorySelect: ['Desenvolvimento', [Validators.required]],
    customCategory: [''],
    dueDate: ['', [Validators.required]]
  });

  ngOnInit(): void {
    if (this.taskToEdit) {
      const cat = this.taskToEdit.category || 'Desenvolvimento';
      const isPreset = this.presetCategories.includes(cat);
      this.taskForm.patchValue({
        title: this.taskToEdit.title,
        description: this.taskToEdit.description || '',
        priority: this.taskToEdit.priority || TaskPriority.MEDIUM,
        categorySelect: isPreset ? cat : 'Outros',
        customCategory: isPreset ? '' : cat,
        dueDate: this.taskToEdit.dueDate ? this.taskToEdit.dueDate.substring(0, 10) : ''
      });
    }
  }

  isCustomCategoryInvalid(): boolean {
    const sel = this.taskForm.get('categorySelect')?.value;
    const custom = this.taskForm.get('customCategory')?.value;
    return sel === 'Outros' && (!custom || custom.trim() === '');
  }

  onSubmit(): void {
    if (this.taskForm.invalid || this.isCustomCategoryInvalid()) {
      this.taskForm.markAllAsTouched();
      return;
    }
    const { title, description, priority, categorySelect, customCategory, dueDate } = this.taskForm.value;
    const finalCategory = categorySelect === 'Outros' ? customCategory?.trim() : categorySelect;

    this.onSave.emit({
      title: title?.trim(),
      description: description?.trim() || undefined,
      priority,
      category: finalCategory,
      dueDate
    });
  }
}
