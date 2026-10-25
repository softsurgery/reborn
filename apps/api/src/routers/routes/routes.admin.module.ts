import { Module } from '@nestjs/common';
import { DeviceInfoController } from 'src/modules/system-reports/controllers/device-info.controller';
import { SystemReportsModule } from 'src/modules/system-reports/system-reports.module';
import { UserController } from 'src/modules/users/controllers/user.controller';
import { UserManagementModule } from 'src/modules/users/user-management.module';
import { PermissionController } from '@softsurgery/nsa-um/controllers/permission.controller';
import { RoleController } from '@softsurgery/nsa-um/controllers/role.controller';
import { LoggerController } from '@softsurgery/nsa-logger/controller/logger.controller';
import { LoggerModule } from '@softsurgery/nsa-logger/logger.module';

@Module({
  controllers: [
    UserController,
    RoleController,
    PermissionController,
    LoggerController,
    DeviceInfoController,
  ],
  providers: [],
  exports: [],
  imports: [UserManagementModule, LoggerModule, SystemReportsModule],
})
export class RoutesAdminModule {}
