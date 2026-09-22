import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<ToastMessage[]>([]);

  showSuccess(title: string, message: string): void {
    this.addToast('success', title, message);
  }

  showError(title: string, message: string): void {
    this.addToast('error', title, message);
  }

  remove(id: string): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  private addToast(type: 'success' | 'error' | 'info', title: string, message: string): void {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, type, title, message };
    this.toasts.update(list => [...list, newToast]);

    setTimeout(() => this.remove(id), 4000);
  }
}
