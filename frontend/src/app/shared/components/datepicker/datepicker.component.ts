import { Component, forwardRef, signal, computed, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isoString: string;
}

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    }
  ],
  template: `
    <div class="relative w-full">
      <div 
        (click)="toggleOpen()" 
        class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-between cursor-pointer hover:border-[#FBB03B]/50 transition-colors select-none">
        <span [ngClass]="formattedDisplay() ? 'text-white' : 'text-white/40'">
          {{ formattedDisplay() || placeholder }}
        </span>
        <svg class="w-4 h-4 text-[#FBB03B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      </div>

      <div 
        *ngIf="isOpen()" 
        class="absolute left-0 bottom-full mb-2 z-50 w-72 bg-[#161b22] rounded-2xl p-4 border border-white/20 shadow-2xl space-y-3 animate-fade-in select-none">
        
        <div class="flex items-center justify-between border-b border-white/10 pb-2">
          <button (click)="prevMonth()" type="button" class="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          <span class="text-xs font-bold text-white capitalize tracking-wide">
            {{ currentMonthName() }} {{ currentYear() }}
          </span>

          <button (click)="nextMonth()" type="button" class="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-7 gap-1 text-center">
          <span *ngFor="let day of weekDays" class="text-[10px] font-bold text-[#b1bbb1] uppercase">
            {{ day }}
          </span>
        </div>

        <div class="grid grid-cols-7 gap-1">
          <button 
            *ngFor="let item of calendarDays()" 
            (click)="selectDate(item)"
            type="button"
            [disabled]="!item.isCurrentMonth"
            [ngClass]="getDayClass(item)"
            class="h-8 w-8 text-xs rounded-xl flex items-center justify-center transition-all cursor-pointer">
            {{ item.dayNumber }}
          </button>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-semibold">
          <button (click)="selectToday()" type="button" class="text-[#FBB03B] hover:underline cursor-pointer">
            Hoje
          </button>
          <button (click)="clearDate()" type="button" class="text-slate-400 hover:text-white cursor-pointer">
            Limpar
          </button>
        </div>
      </div>
    </div>
  `
})
export class DatepickerComponent implements ControlValueAccessor {
  @Input() placeholder: string = 'dd/mm/aaaa';

  isOpen = signal(false);
  selectedIsoDate = signal<string>('');
  viewDate = signal(new Date());

  weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  onChange: any = () => {};
  onTouched: any = () => {};

  currentYear = computed(() => this.viewDate().getFullYear());
  currentMonthName = computed(() => this.monthNames[this.viewDate().getMonth()]);

  formattedDisplay = computed(() => {
    const iso = this.selectedIsoDate();
    if (!iso) return '';
    const parts = iso.split('-');
    if (parts.length < 3) return iso;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  });

  calendarDays = computed(() => {
    const view = this.viewDate();
    const year = view.getFullYear();
    const month = view.getMonth();
    
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayIso = new Date().toISOString().substring(0, 10);
    const selectedIso = this.selectedIsoDate();

    const days: CalendarDay[] = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push(this.createCalendarDay(date, false, todayIso, selectedIso));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push(this.createCalendarDay(date, true, todayIso, selectedIso));
    }

    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(year, month + 1, i);
      days.push(this.createCalendarDay(date, false, todayIso, selectedIso));
    }

    return days;
  });

  private createCalendarDay(date: Date, isCurrentMonth: boolean, todayIso: string, selectedIso: string): CalendarDay {
    const isoString = date.toISOString().substring(0, 10);
    return {
      date,
      dayNumber: date.getDate(),
      isCurrentMonth,
      isToday: isoString === todayIso,
      isSelected: isoString === selectedIso,
      isoString
    };
  }

  toggleOpen(): void {
    this.isOpen.update(v => !v);
  }

  prevMonth(): void {
    const d = this.viewDate();
    this.viewDate.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const d = this.viewDate();
    this.viewDate.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  selectDate(item: CalendarDay): void {
    if (!item.isCurrentMonth) return;
    this.selectedIsoDate.set(item.isoString);
    this.onChange(item.isoString);
    this.onTouched();
    this.isOpen.set(false);
  }

  selectToday(): void {
    const today = new Date();
    const iso = today.toISOString().substring(0, 10);
    this.viewDate.set(today);
    this.selectedIsoDate.set(iso);
    this.onChange(iso);
    this.onTouched();
    this.isOpen.set(false);
  }

  clearDate(): void {
    this.selectedIsoDate.set('');
    this.onChange('');
    this.onTouched();
    this.isOpen.set(false);
  }

  getDayClass(item: CalendarDay): string {
    if (item.isSelected) {
      return 'bg-gradient-to-r from-[#FBB03B] to-[#DC8016] text-[#050505] font-bold shadow-md shadow-[#DC8016]/30';
    }
    if (!item.isCurrentMonth) {
      return 'text-white/20 cursor-default';
    }
    if (item.isToday) {
      return 'border border-[#FBB03B] text-[#FBB03B] font-bold hover:bg-[#FBB03B]/10';
    }
    return 'text-white hover:bg-white/10';
  }

  writeValue(value: any): void {
    if (value && typeof value === 'string') {
      const iso = value.substring(0, 10);
      this.selectedIsoDate.set(iso);
      const parts = iso.split('-');
      if (parts.length === 3) {
        this.viewDate.set(new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
      }
    } else {
      this.selectedIsoDate.set('');
    }
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
    if (!target.closest('app-datepicker')) {
      this.isOpen.set(false);
    }
  }
}
