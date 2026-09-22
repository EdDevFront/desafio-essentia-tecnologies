import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Task, CreateTaskPayload, TaskFilterParams } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/api/tasks';

  tasks = signal<Task[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  loadTasks(filters?: TaskFilterParams): void {
    this.isLoading.set(true);
    let params = new HttpParams();

    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.isCompleted !== undefined && filters.isCompleted !== 'ALL') {
      params = params.set('isCompleted', filters.isCompleted);
    }
    if (filters?.priority) params = params.set('priority', filters.priority);

    this.http.get<Task[]>(this.apiUrl, { params }).subscribe({
      next: (data) => {
        this.tasks.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Erro ao carregar tarefas.');
        this.isLoading.set(false);
      }
    });
  }

  createTask(payload: CreateTaskPayload): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, payload).pipe(
      tap((newTask) => this.tasks.update(list => [newTask, ...list]))
    );
  }

  updateTask(id: string, payload: Partial<CreateTaskPayload>): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, payload).pipe(
      tap((updated) => this.tasks.update(list => list.map(t => t.id === id ? updated : t)))
    );
  }

  toggleComplete(id: string): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/toggle`, {}).pipe(
      tap((updated) => this.tasks.update(list => list.map(t => t.id === id ? updated : t)))
    );
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.tasks.update(list => list.filter(t => t.id !== id)))
    );
  }
}
