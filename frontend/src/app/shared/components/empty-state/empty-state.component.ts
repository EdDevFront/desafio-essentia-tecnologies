import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './empty-state.component.html'
})
export class EmptyStateComponent {
  @Input() title = 'Nenhuma tarefa encontrada';
  @Input() description = 'Você não possui tarefas cadastradas nesta visualização.';
  @Input() actionLabel?: string;
  @Output() onAction = new EventEmitter<void>();
}
