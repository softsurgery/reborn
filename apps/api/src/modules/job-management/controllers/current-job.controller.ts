import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JobService } from '../services/job.service';
import { IQueryObject } from 'nsa-database';
import { PageDto } from 'nsa-database';
import { ApiPaginatedResponse } from 'nsa-database';
import { toDtoArray } from 'nsa-database';
import { LogInterceptor } from 'nsa-logger/decorators/logger.interceptor';
import { AdvancedRequest } from 'nsa-helpers/http';
import { ResponseJobDto } from '../dtos/job/response-job.dto';

@ApiTags('current-job')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/current-job',
})
export class CurrentJobController {
  constructor(private readonly jobService: JobService) {}

  @Get('/list')
  @ApiPaginatedResponse(ResponseJobDto)
  async findPaginated(
    @Query() query: IQueryObject,
    @Request() req: AdvancedRequest,
  ): Promise<PageDto<ResponseJobDto>> {
    const paginated = await this.jobService.findJobsByUserId(
      query,
      req.user?.sub,
    );
    return { ...paginated, data: toDtoArray(ResponseJobDto, paginated.data) };
  }

  @Get('/list-work')
  @ApiPaginatedResponse(ResponseJobDto)
  async findWorkPaginated(
    @Query() query: IQueryObject,
    @Request() req: AdvancedRequest,
  ): Promise<PageDto<ResponseJobDto>> {
    const paginated = await this.jobService.findJobsByWorkerId(
      query,
      req.user?.sub,
    );
    return { ...paginated, data: toDtoArray(ResponseJobDto, paginated.data) };
  }

  @Get('/list-followed')
  @ApiPaginatedResponse(ResponseJobDto)
  async findAllFollowedPaginated(
    @Query() query: IQueryObject,
    @Request() req: AdvancedRequest,
  ): Promise<PageDto<ResponseJobDto>> {
    const paginated = await this.jobService.findAllFollowedPaginated(
      query,
      req.user?.sub,
    );
    return { ...paginated, data: toDtoArray(ResponseJobDto, paginated.data) };
  }
}
