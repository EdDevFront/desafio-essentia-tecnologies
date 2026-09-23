import { IsOptional, IsString, IsBooleanString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriority } from '../schemas/task.schema';

export class TaskFilterDto {
  @ApiPropertyOptional({ description: 'Search term for title or description' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by completed status (true/false)' })
  @IsBooleanString()
  @IsOptional()
  isCompleted?: string;

  @ApiPropertyOptional({ enum: TaskPriority, description: 'Filter by priority level' })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiPropertyOptional({ description: 'Filter by category name' })
  @IsString()
  @IsOptional()
  category?: string;
}
