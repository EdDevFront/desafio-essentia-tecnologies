import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskPriority } from '../../../core/models/task.model';
import { DatepickerComponent } from '../../../shared/components/datepicker/datepicker.component';
import { SelectComponent } from '../../../shared/components/select/select.component';
import { PRESET_CATEGORIES, PRIORITY_OPTIONS, CATEGORY_OPTIONS } from '../../../core/constants/task.constants';

import { FormErrorComponent } from '../../../shared/components/form-error/form-error.component';

@Component({
  selector: 'app-task-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatepickerComponent, SelectComponent, FormErrorComponent],
  templateUrl: './task-form-modal.component.html'
})
export class TaskFormModalComponent implements OnInit {
  @Input() taskToEdit: Task | null = null;
  @Input() errorMessage: string | null = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<any>();

  private fb = inject(FormBuilder);

  presetCategories = PRESET_CATEGORIES;
  priorityOptions = PRIORITY_OPTIONS;
  categoryOptions = CATEGORY_OPTIONS;

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
