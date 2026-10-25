import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IQueryObject } from '@softsurgery/nsa-database';
import { PageDto } from '@softsurgery/nsa-database';
import { ApiPaginatedResponse } from '@softsurgery/nsa-database';
import { toDto, toDtoArray } from '@softsurgery/nsa-database';
import { LogInterceptor } from '@softsurgery/nsa-logger/decorators/logger.interceptor';
import { LogEvent } from '@softsurgery/nsa-logger/decorators/log-event.decorator';
import { EventType } from '@softsurgery/nsa-logger/enums/event-type.registry';
import { AdvancedRequest } from '@softsurgery/nsa-helpers/http';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { ResponseTaskDto } from '../dtos/task/response-task.dto';
import { CreateTaskDto } from '../dtos/task/create-task.dto';
import { UpdateTaskDto } from '../dtos/task/update-task.dto';

@ApiTags('tasks')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/tasks',
})
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/list')
  @ApiPaginatedResponse(ResponseTaskDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseTaskDto>> {
    const paginated = await this.taskService.findAllPaginated(query);
    return {
      ...paginated,
      data: toDtoArray(ResponseTaskDto, paginated.data),
    };
  }

  @Get('/all')
  async findAll(@Query() options: IQueryObject): Promise<ResponseTaskDto[]> {
    return toDtoArray(ResponseTaskDto, await this.taskService.findAll(options));
  }

  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<ResponseTaskDto | null> {
    return toDto(ResponseTaskDto, await this.taskService.findOneById(id));
  }

  @Post()
  @LogEvent(EventType.TASK_CREATE)
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseTaskDto> {
    const task = await this.taskService.save(createTaskDto);
    req.logInfo = { id: task.id };
    return toDto(ResponseTaskDto, task);
  }

  @Put(':id')
  @LogEvent(EventType.TASK_UPDATE)
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseTaskDto | null> {
    req.logInfo = { id };
    return toDto(
      ResponseTaskDto,
      await this.taskService.update(id, updateTaskDto),
    );
  }

  @Delete(':id')
  @LogEvent(EventType.TASK_DELETE)
  async delete(
    @Param('id') id: string,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseTaskDto | null> {
    req.logInfo = { id };
    return toDto(ResponseTaskDto, await this.taskService.softDelete(id));
  }
}
