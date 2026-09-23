import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 400, description: 'Código do status HTTP do erro' })
  statusCode: number;

  @ApiProperty({ example: 'Os dados enviados são inválidos.', description: 'Mensagem amigável descrevendo a causa do erro' })
  message: string;

  @ApiProperty({ example: 'Bad Request', description: 'Nome do erro HTTP' })
  error: string;

  @ApiProperty({ example: '2026-09-23T14:57:00.000Z', description: 'Data e hora em formato ISO no momento do erro' })
  timestamp: string;

  @ApiProperty({ example: '/api/tasks', description: 'Caminho da rota HTTP em que o erro ocorreu' })
  path: string;
}

export class BadRequestErrorDto extends ErrorResponseDto {
  @ApiProperty({ example: 400, description: 'Código 400 Bad Request' })
  override statusCode: number = 400;

  @ApiProperty({ example: 'O título da tarefa é obrigatório.', description: 'Mensagem amigável de erro de validação' })
  override message: string = 'O título da tarefa é obrigatório.';

  @ApiProperty({ example: 'Bad Request', description: 'Nome do erro' })
  override error: string = 'Bad Request';

  @ApiProperty({ example: '2026-09-23T14:57:00.000Z', description: 'Data e hora no formato ISO' })
  override timestamp: string = '2026-09-23T14:57:00.000Z';

  @ApiProperty({ example: '/api/tasks', description: 'Rota da requisição' })
  override path: string = '/api/tasks';
}

export class UnauthorizedErrorDto extends ErrorResponseDto {
  @ApiProperty({ example: 401, description: 'Código 401 Unauthorized' })
  override statusCode: number = 401;

  @ApiProperty({ example: 'Credenciais (e-mail ou senha) inválidas.', description: 'Mensagem amigável de autenticação' })
  override message: string = 'Credenciais (e-mail ou senha) inválidas.';

  @ApiProperty({ example: 'Unauthorized', description: 'Nome do erro' })
  override error: string = 'Unauthorized';

  @ApiProperty({ example: '2026-09-23T14:57:00.000Z', description: 'Data e hora no formato ISO' })
  override timestamp: string = '2026-09-23T14:57:00.000Z';

  @ApiProperty({ example: '/api/auth/login', description: 'Rota da requisição' })
  override path: string = '/api/auth/login';
}

export class NotFoundErrorDto extends ErrorResponseDto {
  @ApiProperty({ example: 404, description: 'Código 404 Not Found' })
  override statusCode: number = 404;

  @ApiProperty({ example: 'Tarefa não encontrada.', description: 'Mensagem de recurso não encontrado' })
  override message: string = 'Tarefa não encontrada.';

  @ApiProperty({ example: 'Not Found', description: 'Nome do erro' })
  override error: string = 'Not Found';

  @ApiProperty({ example: '2026-09-23T14:57:00.000Z', description: 'Data e hora no formato ISO' })
  override timestamp: string = '2026-09-23T14:57:00.000Z';

  @ApiProperty({ example: '/api/tasks/123-abc', description: 'Rota da requisição' })
  override path: string = '/api/tasks/123-abc';
}

export class ConflictErrorDto extends ErrorResponseDto {
  @ApiProperty({ example: 409, description: 'Código 409 Conflict' })
  override statusCode: number = 409;

  @ApiProperty({ example: 'Este e-mail já está cadastrado na plataforma.', description: 'Mensagem de conflito' })
  override message: string = 'Este e-mail já está cadastrado na plataforma.';

  @ApiProperty({ example: 'Conflict', description: 'Nome do erro' })
  override error: string = 'Conflict';

  @ApiProperty({ example: '2026-09-23T14:57:00.000Z', description: 'Data e hora no formato ISO' })
  override timestamp: string = '2026-09-23T14:57:00.000Z';

  @ApiProperty({ example: '/api/auth/register', description: 'Rota da requisição' })
  override path: string = '/api/auth/register';
}

export class InternalServerErrorDto extends ErrorResponseDto {
  @ApiProperty({ example: 500, description: 'Código 500 Internal Server Error' })
  override statusCode: number = 500;

  @ApiProperty({ example: 'Erro interno no servidor. Tente novamente mais tarde.', description: 'Mensagem de erro interno' })
  override message: string = 'Erro interno no servidor. Tente novamente mais tarde.';

  @ApiProperty({ example: 'Internal Server Error', description: 'Nome do erro' })
  override error: string = 'Internal Server Error';

  @ApiProperty({ example: '2026-09-23T14:57:00.000Z', description: 'Data e hora no formato ISO' })
  override timestamp: string = '2026-09-23T14:57:00.000Z';

  @ApiProperty({ example: '/api/tasks', description: 'Rota da requisição' })
  override path: string = '/api/tasks';
}
