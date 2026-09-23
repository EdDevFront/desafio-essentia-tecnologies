import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

  async findAll(userId: string, filters: TaskFilterDto): Promise<any[]> {
    const filterQuery: any = { userId };

    if (filters.search) {
      const regex = new RegExp(filters.search, 'i');
      filterQuery.$or = [
        { title: regex },
        { description: regex },
      ];
    }

    if (filters.isCompleted !== undefined) {
      filterQuery.isCompleted = filters.isCompleted === 'true';
    }

    if (filters.priority) {
      filterQuery.priority = filters.priority;
    }

    if (filters.category) {
      filterQuery.category = filters.category;
    }

    const tasks = await this.taskModel.find(filterQuery).sort({ createdAt: -1 }).exec();
    return tasks.map(t => t.toJSON());
  }

  async findOne(id: string, userId: string): Promise<any> {
    let task: TaskDocument | null = null;
    try {
      task = await this.taskModel.findOne({ _id: id, userId }).exec();
    } catch {
      // Invalid ObjectId format
    }
    if (!task) {
      throw new NotFoundException('Tarefa não encontrada.');
    }
    return task.toJSON();
  }

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<any> {
    const createdTask = new this.taskModel({
      ...createTaskDto,
      userId,
    });
    const saved = await createdTask.save();
    return saved.toJSON();
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<any> {
    let updated: TaskDocument | null = null;
    try {
      updated = await this.taskModel.findOneAndUpdate(
        { _id: id, userId },
        { $set: updateTaskDto },
        { new: true }
      ).exec();
    } catch {
      // Invalid ObjectId format
    }
    if (!updated) {
      throw new NotFoundException('Tarefa não encontrada.');
    }
    return updated.toJSON();
  }

  async toggleComplete(id: string, userId: string): Promise<any> {
    let task: TaskDocument | null = null;
    try {
      task = await this.taskModel.findOne({ _id: id, userId }).exec();
    } catch {
      // Invalid ObjectId format
    }
    if (!task) {
      throw new NotFoundException('Tarefa não encontrada.');
    }
    task.isCompleted = !task.isCompleted;
    const saved = await task.save();
    return saved.toJSON();
  }

  async remove(id: string, userId: string): Promise<void> {
    let deleted: TaskDocument | null = null;
    try {
      deleted = await this.taskModel.findOneAndDelete({ _id: id, userId }).exec();
    } catch {
      // Invalid ObjectId format
    }
    if (!deleted) {
      throw new NotFoundException('Tarefa não encontrada.');
    }
  }
}
