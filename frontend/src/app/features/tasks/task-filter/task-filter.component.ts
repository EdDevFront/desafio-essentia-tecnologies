import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button/button.component';

export interface TaskFilterValues {
  search?: string;
  isCompleted?: string;
}

@Component({
  selector: 'app-task-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './task-filter.component.html'
})
export class TaskFilterComponent {
  searchQuery = '';
  statusFilter = 'ALL';
  isApplied = false;

  @Output() onFilter = new EventEmitter<TaskFilterValues>();
  @Output() onClear = new EventEmitter<void>();

  applyFilters(): void {
    const search = this.searchQuery.trim();
    const isCompleted = this.statusFilter;
    this.isApplied = search !== '' || isCompleted !== 'ALL';

    this.onFilter.emit({ search, isCompleted });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.statusFilter = 'ALL';
    this.isApplied = false;

    this.onClear.emit();
  }
}
