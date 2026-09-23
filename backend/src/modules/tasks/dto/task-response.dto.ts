import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriority } from '../entities/task.entity';

export class TaskResponseDto {
  @ApiProperty({ example: 'f8c3b1a2-9d4e-4f5a-8b6c-7d8e9f0a1b2c', description: 'Identificador único da tarefa' })
  id: string;

  @ApiProperty({ example: 'Implementar documentação Swagger completa', description: 'Título da tarefa' })
  title: string;

  @ApiPropertyOptional({ example: 'Adicionar DTOs de erro e resposta para todos os endpoints', description: 'Descrição detalhada' })
  description?: string;

  @ApiProperty({ example: false, description: 'Status de conclusão da tarefa' })
  isCompleted: boolean;

  @ApiProperty({ enum: TaskPriority, example: TaskPriority.HIGH, description: 'Nível de prioridade' })
  priority: TaskPriority;

  @ApiPropertyOptional({ example: 'Backend', description: 'Categoria da tarefa' })
  category?: string;

  @ApiPropertyOptional({ example: '2026-09-30T18:00:00.000Z', description: 'Data limite de conclusão' })
  dueDate?: Date;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'ID do usuário proprietário' })
  userId: string;

  @ApiProperty({ example: '2026-09-23T12:00:00.000Z', description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ example: '2026-09-23T12:00:00.000Z', description: 'Data de atualização' })
  updatedAt: Date;
}
