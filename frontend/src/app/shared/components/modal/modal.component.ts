import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ModalMaxWidth = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html'
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() maxWidth: ModalMaxWidth = 'md';

  @Output() onClose = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onKeydownHandler(): void {
    this.onClose.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    this.onClose.emit();
  }

  getMaxWidthClass(): string {
    switch (this.maxWidth) {
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      default:
        return 'max-w-md';
    }
  }
}
