import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, FilterQuery } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
  ) {}

  private validateObjectId(id: string): void {
    const isInvalidIdFormat = !Types.ObjectId.isValid(id);
    if (isInvalidIdFormat) {
      throw new NotFoundException('Tarefa não encontrada.');
    }
  }

  async findAll(userId: string, filters: TaskFilterDto): Promise<Record<string, unknown>[]> {
    const filterQuery: FilterQuery<TaskDocument> = { userId };

    const hasSearchTerm = Boolean(filters.search);
    if (hasSearchTerm) {
      const regex = new RegExp(filters.search!, 'i');
      filterQuery.$or = [
        { title: regex },
        { description: regex },
      ];
    }

    const hasCompletedFilter = filters.isCompleted !== undefined;
    if (hasCompletedFilter) {
      filterQuery.isCompleted = filters.isCompleted === 'true';
    }

    const hasPriorityFilter = Boolean(filters.priority);
    if (hasPriorityFilter) {
      filterQuery.priority = filters.priority;
    }

    const hasCategoryFilter = Boolean(filters.category);
    if (hasCategoryFilter) {
      filterQuery.category = filters.category;
    }

    const tasks = await this.taskModel.find(filterQuery).sort({ createdAt: -1 }).exec();
    return tasks.map(t => t.toJSON() as Record<string, unknown>);
  }

  async findOne(id: string, userId: string): Promise<Record<string, unknown>> {
    this.validateObjectId(id);
    const task = await this.taskModel.findOne({ _id: id, userId }).exec();
    const isTaskNotFound = !task;

    if (isTaskNotFound) {
      throw new NotFoundException('Tarefa não encontrada.');
    }
    return task.toJSON() as Record<string, unknown>;
  }

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Record<string, unknown>> {
    const createdTask = new this.taskModel({
      ...createTaskDto,
      userId,
    });
    const saved = await createdTask.save();
    return saved.toJSON() as Record<string, unknown>;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Record<string, unknown>> {
    this.validateObjectId(id);
    const updated = await this.taskModel.findOneAndUpdate(
      { _id: id, userId },
      { $set: updateTaskDto },
      { new: true }
    ).exec();
    const isTaskNotFound = !updated;

    if (isTaskNotFound) {
      throw new NotFoundException('Tarefa não encontrada.');
    }
    return updated.toJSON() as Record<string, unknown>;
  }

  async toggleComplete(id: string, userId: string): Promise<Record<string, unknown>> {
    this.validateObjectId(id);
    const task = await this.taskModel.findOne({ _id: id, userId }).exec();
    const isTaskNotFound = !task;

    if (isTaskNotFound) {
      throw new NotFoundException('Tarefa não encontrada.');
    }
    task.isCompleted = !task.isCompleted;
    const saved = await task.save();
    return saved.toJSON() as Record<string, unknown>;
  }

  async remove(id: string, userId: string): Promise<void> {
    this.validateObjectId(id);
    const deleted = await this.taskModel.findOneAndDelete({ _id: id, userId }).exec();
    const isTaskNotFound = !deleted;

    if (isTaskNotFound) {
      throw new NotFoundException('Tarefa não encontrada.');
    }
  }
}
