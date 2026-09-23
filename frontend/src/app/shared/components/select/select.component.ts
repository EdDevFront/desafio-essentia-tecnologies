import { Component, forwardRef, signal, computed, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  templateUrl: './select.component.html'
})
export class SelectComponent implements ControlValueAccessor {
  @Input() options: Array<SelectOption | string> = [];
  @Input() placeholder: string = 'Selecione...';

  isOpen = signal(false);
  selectedValue = signal<any>(null);

  onChange: any = () => {};
  onTouched: any = () => {};

  parsedOptions = computed<SelectOption[]>(() => {
    return this.options.map(opt => {
      if (typeof opt === 'string') {
        return { label: opt, value: opt };
      }
      return opt;
    });
  });

  selectedOption = computed(() => {
    const val = this.selectedValue();
    return this.parsedOptions().find(o => o.value === val) || null;
  });

  isSelected(opt: SelectOption): boolean {
    return this.selectedValue() === opt.value;
  }

  toggleOpen(): void {
    this.isOpen.update(v => !v);
  }

  selectOption(opt: SelectOption): void {
    this.selectedValue.set(opt.value);
    this.onChange(opt.value);
    this.onTouched();
    this.isOpen.set(false);
  }

  writeValue(value: any): void {
    this.selectedValue.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('app-select')) {
      this.isOpen.set(false);
    }
  }
}
