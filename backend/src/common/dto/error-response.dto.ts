import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 400, description: 'Código do status HTTP do erro' })
  statusCode: number;

  @ApiProperty({ example: 'Dados de entrada inválidos. O campo email deve ser um e-mail válido.', description: 'Mensagem amigável descrevendo a causa do erro' })
  message: string;

  @ApiProperty({ example: 'BadRequestException', description: 'Nome do tipo da exceção disparada' })
  error: string;

  @ApiProperty({ example: '2026-09-23T13:16:00.000Z', description: 'Data e hora em formato ISO no momento do erro' })
  timestamp: string;

  @ApiProperty({ example: '/api/tasks/123', description: 'Caminho da rota HTTP em que o erro ocorreu' })
  path: string;
}
