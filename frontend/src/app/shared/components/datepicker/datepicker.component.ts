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
  templateUrl: './datepicker.component.html'
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

  displayText = computed(() => this.formattedDisplay() || this.placeholder);
  displayLabelClass = computed(() => this.formattedDisplay() ? 'text-white' : 'text-white/40');

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
