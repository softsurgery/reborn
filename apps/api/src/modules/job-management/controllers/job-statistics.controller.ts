import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LogInterceptor } from '@softsurgery/nsa-logger/decorators/logger.interceptor';
import { toDto } from '@softsurgery/nsa-database';
import { JobStatisticsService } from '../services/job-statistics.service';
import { ResponseJobStatisticsDto } from '../dtos/job-statistics/response-job-statistics.dto';

@ApiTags('job-statistics')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/job-statistics',
})
export class JobStatisticsController {
  constructor(private readonly jobStatisticsService: JobStatisticsService) {}

  @Get(':id')
  async findOneById(
    @Param('id') id: string,
  ): Promise<ResponseJobStatisticsDto | null> {
    return toDto(
      ResponseJobStatisticsDto,
      await this.jobStatisticsService.findJobStatisticsById(id),
    );
  }
}
