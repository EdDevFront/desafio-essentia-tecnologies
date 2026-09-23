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
  template: `
    <div class="relative w-full">
      <div 
        (click)="toggleOpen()" 
        class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-between cursor-pointer hover:border-[#FBB03B]/50 transition-colors select-none">
        <span [ngClass]="selectedOption() ? 'text-white' : 'text-white/40'">
          {{ selectedOption() ? selectedOption()?.label : placeholder }}
        </span>
        <svg 
          class="w-4 h-4 text-[#FBB03B] transition-transform duration-200" 
          [class.rotate-180]="isOpen()"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>

      <div 
        *ngIf="isOpen()" 
        class="absolute left-0 top-full mt-2 z-50 w-full bg-[#161b22] rounded-xl p-1.5 border border-white/20 shadow-2xl space-y-1 animate-fade-in select-none max-h-56 overflow-y-auto">
        <div 
          *ngFor="let opt of parsedOptions()" 
          (click)="selectOption(opt)"
          [ngClass]="isSelected(opt) ? 'bg-[#FBB03B]/15 text-[#FBB03B] font-semibold' : 'text-slate-200 hover:bg-white/10 hover:text-white'"
          class="px-3.5 py-2 text-sm rounded-lg flex items-center justify-between cursor-pointer transition-colors">
          <span>{{ opt.label }}</span>
          <svg *ngIf="isSelected(opt)" class="w-4 h-4 text-[#FBB03B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      </div>
    </div>
  `
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
