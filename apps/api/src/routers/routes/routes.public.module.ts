import { Module } from '@nestjs/common';
import { LoggerModule } from 'nsa-logger/logger.module';

@Module({
  controllers: [],
  providers: [],
  exports: [],
  imports: [LoggerModule],
})
export class RoutesPublicModule {}
