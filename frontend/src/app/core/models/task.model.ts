export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority: TaskPriority;
  category?: string;
  dueDate?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority?: TaskPriority;
  category?: string;
  dueDate?: string;
}

export interface TaskFilterParams {
  search?: string;
  isCompleted?: string;
  priority?: TaskPriority;
  category?: string;
}
