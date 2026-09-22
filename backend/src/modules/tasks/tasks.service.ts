import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async findAll(userId: string, filters: TaskFilterDto): Promise<Task[]> {
    const query = this.taskRepository.createQueryBuilder('task')
      .where('task.userId = :userId', { userId });

    if (filters.search) {
      query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {
        search: `%${filters.search}%`,
      });
    }

    if (filters.isCompleted !== undefined) {
      const isCompletedBool = filters.isCompleted === 'true';
      query.andWhere('task.isCompleted = :isCompleted', { isCompleted: isCompletedBool });
    }

    if (filters.priority) {
      query.andWhere('task.priority = :priority', { priority: filters.priority });
    }

    if (filters.category) {
      query.andWhere('task.category = :category', { category: filters.category });
    }

    return query.orderBy('task.createdAt', 'DESC').getMany();
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id, userId } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      userId,
    });
    return this.taskRepository.save(task);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task> {
    const task = await this.findOne(id, userId);
    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  async toggleComplete(id: string, userId: string): Promise<Task> {
    const task = await this.findOne(id, userId);
    task.isCompleted = !task.isCompleted;
    return this.taskRepository.save(task);
  }

  async remove(id: string, userId: string): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.taskRepository.remove(task);
  }
}
