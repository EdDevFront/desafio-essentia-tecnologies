import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { ErrorResponseDto } from '../../common/dto/error-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as tarefas do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de tarefas retornada com sucesso', type: [TaskResponseDto] })
  @ApiResponse({ status: 401, description: 'Não autorizado - Token ausente ou inválido', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor', type: ErrorResponseDto })
  findAll(@GetUser('id') userId: string, @Query() filters: TaskFilterDto) {
    return this.tasksService.findAll(userId, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de uma tarefa específica' })
  @ApiResponse({ status: 200, description: 'Tarefa encontrada com sucesso', type: TaskResponseDto })
  @ApiResponse({ status: 401, description: 'Não autorizado - Token ausente ou inválido', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada ou pertence a outro usuário', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor', type: ErrorResponseDto })
  findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.tasksService.findOne(id, userId);
  }

  @Post()
  @ApiOperation({ summary: 'Criar uma nova tarefa' })
  @ApiResponse({ status: 201, description: 'Tarefa criada com sucesso', type: TaskResponseDto })
  @ApiResponse({ status: 400, description: 'Dados de criação inválidos', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Não autorizado - Token ausente ou inválido', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor', type: ErrorResponseDto })
  create(@Body() createTaskDto: CreateTaskDto, @GetUser('id') userId: string) {
    return this.tasksService.create(createTaskDto, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma tarefa existente' })
  @ApiResponse({ status: 200, description: 'Tarefa atualizada com sucesso', type: TaskResponseDto })
  @ApiResponse({ status: 400, description: 'Dados de atualização inválidos', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Não autorizado - Token ausente ou inválido', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor', type: ErrorResponseDto })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser('id') userId: string,
  ) {
    return this.tasksService.update(id, updateTaskDto, userId);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Alternar status de conclusão da tarefa' })
  @ApiResponse({ status: 200, description: 'Status de conclusão alternado com sucesso', type: TaskResponseDto })
  @ApiResponse({ status: 401, description: 'Não autorizado - Token ausente ou inválido', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor', type: ErrorResponseDto })
  toggleComplete(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.tasksService.toggleComplete(id, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir uma tarefa' })
  @ApiResponse({ status: 200, description: 'Tarefa excluída com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado - Token ausente ou inválido', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor', type: ErrorResponseDto })
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.tasksService.remove(id, userId);
  }
}
