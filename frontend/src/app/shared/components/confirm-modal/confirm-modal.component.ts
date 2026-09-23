import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent, ButtonComponent],
  templateUrl: './confirm-modal.component.html'
})
export class ConfirmModalComponent {
  @Input({ required: true }) title: string = 'Confirmar Exclusão';
  @Input({ required: true }) message: string = 'Tem certeza que deseja realizar esta ação?';
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
}
