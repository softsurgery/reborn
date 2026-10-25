import { ApiProperty } from '@nestjs/swagger';
import { ResponseDtoHelper } from 'nsa-database';
import { Expose, Type } from 'class-transformer';
import { ResponseJobDto } from '../job/response-job.dto';
import { ResponseStorageDto } from 'nsa-storage/dtos/response-storage.dto';

export class ResponseJobUploadDto extends ResponseDtoHelper {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ type: String })
  @Expose()
  jobId: string;

  @ApiProperty({ type: () => ResponseJobDto })
  @Expose()
  @Type(() => ResponseJobDto)
  job?: ResponseJobDto;

  @ApiProperty({ type: Number })
  @Expose()
  uploadId: number;

  @ApiProperty({ type: () => ResponseStorageDto })
  @Expose()
  @Type(() => ResponseStorageDto)
  upload?: ResponseStorageDto;

  @ApiProperty({ type: Number })
  @Expose()
  order: number;
}
