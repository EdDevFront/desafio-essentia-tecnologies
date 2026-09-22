import { IsNotEmpty, IsString, IsOptional, IsEnum, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriority } from '../entities/task.entity';

export class CreateTaskDto {
  @ApiProperty({ example: 'Finalizar documentação da API', description: 'Task title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Escrever especificações OpenAPI e Swagger', description: 'Detailed description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: TaskPriority, default: TaskPriority.MEDIUM, description: 'Priority level' })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiPropertyOptional({ example: 'Desenvolvimento', description: 'Category badge' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: '2026-10-01T18:00:00.000Z', description: 'Due date' })
  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @ApiPropertyOptional({ default: false, description: 'Completion status' })
  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}
