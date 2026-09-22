import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'List all tasks for the current user' })
  findAll(@GetUser('id') userId: string, @Query() filters: TaskFilterDto) {
    return this.tasksService.findAll(userId, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific task' })
  findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.tasksService.findOne(id, userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  create(@Body() createTaskDto: CreateTaskDto, @GetUser('id') userId: string) {
    return this.tasksService.create(createTaskDto, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing task' })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser('id') userId: string,
  ) {
    return this.tasksService.update(id, updateTaskDto, userId);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Toggle completion status of a task' })
  toggleComplete(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.tasksService.toggleComplete(id, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.tasksService.remove(id, userId);
  }
}
