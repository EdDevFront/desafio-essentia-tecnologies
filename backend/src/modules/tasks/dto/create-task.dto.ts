import { IsNotEmpty, IsString, IsOptional, IsEnum, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriority } from '../entities/task.entity';

export class CreateTaskDto {
  @ApiProperty({ example: 'Finalizar documentação da API', description: 'Task title' })
  @IsString({ message: 'O título deve ser um texto.' })
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  title: string;

  @ApiPropertyOptional({ example: 'Escrever especificações OpenAPI e Swagger', description: 'Detailed description' })
  @IsString({ message: 'A descrição deve ser um texto.' })
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: TaskPriority, default: TaskPriority.MEDIUM, description: 'Priority level' })
  @IsEnum(TaskPriority, { message: 'A prioridade deve ser Baixa, Média, Alta ou Urgente.' })
  @IsNotEmpty({ message: 'A prioridade é obrigatória.' })
  priority: TaskPriority;

  @ApiProperty({ example: 'Desenvolvimento', description: 'Category badge' })
  @IsString({ message: 'A categoria deve ser um texto.' })
  @IsNotEmpty({ message: 'A categoria é obrigatória.' })
  category: string;

  @ApiProperty({ example: '2026-10-01T18:00:00.000Z', description: 'Due date' })
  @IsDateString({}, { message: 'A data de entrega informada é inválida.' })
  @IsNotEmpty({ message: 'A data de entrega é obrigatória.' })
  dueDate: Date;

  @ApiPropertyOptional({ default: false, description: 'Completion status' })
  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}
