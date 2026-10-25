import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { MailModule } from 'nsa-mail/mail.module';
import { ClientAuthService } from './services/client-auth.service';
import { ConfigurationsModule } from 'nsa-configurations/configurations.module';
import { StorageModule } from 'nsa-storage/storage.module';
import { AuthProvidersService } from './services/auth-provider.service';
import { NotificationModule } from 'nsa-notifications/notifications.module';

@Module({
  imports: [
    ConfigModule,
    ConfigurationsModule,
    MailModule,
    StorageModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [
    AuthService,
    AuthProvidersService,
    ClientAuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [AuthService, ClientAuthService, AuthProvidersService],
})
export class AuthModule {}
