import { Global, Module } from '@nestjs/common';
import {
  USER_REPOSITORY,
  USER_SERVICE,
} from 'nsa-um/tokens/user-access';
import { PermissionService } from 'nsa-um/services/permission.service';
import { RolePermissionService } from 'nsa-um/services/role-permission.service';
import { RoleService } from 'nsa-um/services/role.service';
import { RoleRepository } from 'nsa-um/repositories/role.repository';
import { PermissionRepository } from 'nsa-um/repositories/permission.repository';
import { RolePermissionRepository } from 'nsa-um/repositories/role-permission.repository';
import { FollowRepository } from 'src/modules/users/repositories/follow.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbstractUserEntity } from 'nsa-um/entities/abstract-user.entity';
import { RoleEntity } from 'nsa-um/entities/role.entity';
import { PermissionEntity } from 'nsa-um/entities/permission.entity';
import { RolePermissionEntity } from 'nsa-um/entities/role-permission.entity';
import { UserUploadEntity } from './entities/user-upload.entity';
import { UserEntity } from './entities/user.entity';
import { FollowEntity } from 'src/modules/users/entities/follow.entity';
import { ReferenceTypesModule } from 'nsa-reference-types/reference-types.module';
import { StorageModule } from 'nsa-storage/storage.module';
import { UserService } from './services/user.service';
import { UserUploadService } from './services/user-upload.service';
import { FollowService } from './services/follow.service';
import { ExperienceService } from './services/experience.service';
import { EducationService } from './services/education.service';
import { UserRepository } from './repositories/user.repository';
import { UserUploadRepository } from './repositories/user-upload.repository';
import { ExperienceRepository } from './repositories/experience.repository';
import { EducationRepository } from './repositories/education.repository';
import { ExperienceEntity } from './entities/experience.entity';
import { EducationEntity } from './entities/education.entity';
import { UserStorageFolderService } from './services/user-storage-folder.service';
import { ConfigurationsModule } from 'nsa-configurations/configurations.module';
import { UserBlockService } from './services/user-block.service';
import { UserBlockRepository } from './repositories/user-block.repository';
import { UserBlockEntity } from './entities/user-block.entity';
import { UserConfigurationService } from './services/user-configuration.service';

@Global()
@Module({
  controllers: [],
  providers: [
    //services
    UserService,
    UserUploadService,
    UserStorageFolderService,
    UserBlockService,
    UserConfigurationService,

    RoleService,
    PermissionService,
    RolePermissionService,

    FollowService,
    ExperienceService,
    EducationService,

    //repositories
    UserRepository,
    UserUploadRepository,
    UserBlockRepository,

    RoleRepository,
    PermissionRepository,
    RolePermissionRepository,

    FollowRepository,
    ExperienceRepository,
    EducationRepository,
    { provide: USER_SERVICE, useExisting: UserService },
    { provide: USER_REPOSITORY, useExisting: UserRepository },
  ],
  exports: [
    //services
    UserService,
    UserUploadService,
    UserStorageFolderService,
    UserBlockService,
    UserConfigurationService,

    RoleService,
    PermissionService,
    RolePermissionService,

    FollowService,
    ExperienceService,
    EducationService,

    //repositories
    UserRepository,
    UserUploadRepository,
    UserBlockRepository,

    RoleRepository,
    PermissionRepository,
    RolePermissionRepository,

    FollowRepository,
    ExperienceRepository,
    EducationRepository,
    USER_SERVICE,
    USER_REPOSITORY,
  ],
  imports: [
    TypeOrmModule.forFeature([
      AbstractUserEntity,
      UserEntity,
      UserUploadEntity,
      UserBlockEntity,
      RoleEntity,
      PermissionEntity,
      RolePermissionEntity,
      FollowEntity,
      ExperienceEntity,
      EducationEntity,
    ]),
    StorageModule,
    ReferenceTypesModule,
    ConfigurationsModule,
  ],
})
export class UserManagementModule {}
