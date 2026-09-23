import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html'
})
export class ConfirmModalComponent {
  @Input({ required: true }) title: string = 'Confirmar Exclusão';
  @Input({ required: true }) message: string = 'Tem certeza que deseja realizar esta ação?';
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
}
