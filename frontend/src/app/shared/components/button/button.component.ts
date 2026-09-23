import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  host: {
    '[class]': 'hostClasses'
  },
  templateUrl: './button.component.html'
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() loadingText: string = '';
  @Input() customClass: string = '';

  @Output() onClick = new EventEmitter<MouseEvent>();

  get hostClasses(): string {
    return this.customClass.includes('w-full') ? 'block w-full' : 'inline-block';
  }

  handleClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.onClick.emit(event);
    }
  }

  getClasses(): string {
    const base = 'cursor-pointer font-bold transition-all duration-200 inline-flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    let variantClass = '';
    switch (this.variant) {
      case 'primary':
        variantClass = 'techx-btn-pill shadow-lg shadow-[#DC8016]/20';
        break;
      case 'secondary':
        variantClass = 'rounded-full border border-white/10 text-slate-300 hover:bg-white/5 bg-white/5';
        break;
      case 'danger':
        variantClass = 'rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30';
        break;
      case 'ghost':
        variantClass = 'rounded-xl bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 hover:text-white';
        break;
      case 'outline':
        variantClass = 'text-[#FBB03B] hover:underline font-semibold px-2 py-1';
        break;
    }

    let sizeClass = '';
    if (this.variant !== 'primary') {
      switch (this.size) {
        case 'sm':
          sizeClass = 'text-xs px-3 py-1.5';
          break;
        case 'md':
          sizeClass = 'text-sm px-5 py-2';
          break;
        case 'lg':
          sizeClass = 'text-base px-6 py-3';
          break;
      }
    } else {
      switch (this.size) {
        case 'sm':
          sizeClass = 'text-xs px-4 py-2';
          break;
        case 'md':
          sizeClass = 'text-sm px-6 py-3';
          break;
        case 'lg':
          sizeClass = 'text-base px-8 py-3.5';
          break;
      }
    }

    return `${base} ${variantClass} ${sizeClass}`;
  }
}
