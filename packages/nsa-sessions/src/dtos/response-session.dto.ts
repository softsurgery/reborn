import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseDtoHelper } from 'nsa-database';
import { ResponseAbstractUserDto } from 'nsa-um/dtos/abstract-user/response-abstract-user.dto';
import { SessionType } from 'nsa-sessions/enums/session-type.registry';

export class ResponseSessionDto extends ResponseDtoHelper {
  @ApiProperty({ type: Number, example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ type: String, example: '1' })
  @Expose()
  userId?: string;

  @ApiProperty({ type: ResponseAbstractUserDto })
  @Expose()
  @Type(() => ResponseAbstractUserDto)
  user: ResponseAbstractUserDto;

  @ApiProperty({ type: String, enum: SessionType })
  @Expose()
  type: SessionType;

  @ApiProperty({ type: Date })
  @Expose()
  planned_start?: Date;

  @ApiProperty({ type: Date })
  @Expose()
  planned_end?: Date;

  @ApiProperty({ type: Date })
  @Expose()
  started?: Date;

  @ApiProperty({ type: Date })
  @Expose()
  ended?: Date;

  @ApiProperty({ type: Object })
  @Expose()
  payload?: object;
}
