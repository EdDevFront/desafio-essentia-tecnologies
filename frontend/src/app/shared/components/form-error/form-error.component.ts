import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [CommonModule],
  host: {
    class: 'block w-full'
  },
  templateUrl: './form-error.component.html'
})
export class FormErrorComponent {
  @Input() show: boolean = false;
  @Input() message: string = '';
}
