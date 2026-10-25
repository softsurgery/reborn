import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IQueryObject } from 'nsa-database';
import { PageDto } from 'nsa-database';
import { ApiPaginatedResponse } from 'nsa-database';
import { toDto, toDtoArray } from 'nsa-database';
import { LogInterceptor } from 'nsa-logger/decorators/logger.interceptor';
import { LogEvent } from 'nsa-logger/decorators/log-event.decorator';
import { EventType } from 'src/app/enums/event-type.enum';
import { AdvancedRequest } from 'nsa-helpers/http';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { JobViewService } from '../services/job-view.service';
import { ResponseJobViewDto } from '../dtos/job-view/response-job-view.dto';
import { CreateJobViewDto } from '../dtos/job-view/create-job-view.dto';

@ApiTags('job-view')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/job-view',
})
export class JobViewController {
  constructor(private readonly jobViewService: JobViewService) {}

  @Get('/list')
  @ApiPaginatedResponse(ResponseJobViewDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseJobViewDto>> {
    const paginated = await this.jobViewService.findAllPaginated(query);
    return {
      ...paginated,
      data: toDtoArray(ResponseJobViewDto, paginated.data),
    };
  }

  @Get('/user-list')
  @ApiPaginatedResponse(ResponseJobViewDto)
  async findAllUserPaginated(
    @Query() query: IQueryObject,
    @Request() req: AdvancedRequest,
  ): Promise<PageDto<ResponseJobViewDto>> {
    const paginated = await this.jobViewService.findAllUserPaginated(
      query,
      req.user?.sub,
    );
    return {
      ...paginated,
      data: toDtoArray(ResponseJobViewDto, paginated.data),
    };
  }

  @Get('/all')
  async findAll(@Query() options: IQueryObject): Promise<ResponseJobViewDto[]> {
    return toDtoArray(
      ResponseJobViewDto,
      await this.jobViewService.findAll(options),
    );
  }

  @Get(':id')
  async findOneById(
    @Param('id') id: number,
  ): Promise<ResponseJobViewDto | null> {
    return toDto(ResponseJobViewDto, await this.jobViewService.findOneById(id));
  }

  @Get(':id/exists')
  async isJobViewAlreadyExists(
    @Param('id') id: string,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseJobViewDto | null> {
    return toDto(
      ResponseJobViewDto,
      await this.jobViewService.isJobViewAlreadyExists(id, req.user?.sub),
    );
  }

  @Post()
  @LogEvent(EventType.JOB_VIEW_CREATE)
  async create(
    @Body() createJobRequestDto: CreateJobViewDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseJobViewDto> {
    const jobView = await this.jobViewService.markAsViewed(
      createJobRequestDto.jobId,
      req.user?.sub,
    );
    req.logInfo = { id: jobView.id };
    return toDto(ResponseJobViewDto, jobView);
  }

  @Delete(':id')
  @LogEvent(EventType.JOB_VIEW_DELETE)
  async delete(
    @Param('id') id: number,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseJobViewDto | null> {
    req.logInfo = { id };
    return toDto(ResponseJobViewDto, await this.jobViewService.softDelete(id));
  }
}
