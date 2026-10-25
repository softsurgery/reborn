import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationNamespaceEntity } from './entities/configuration-namespace.entity';
import { ConfigurationParamEntity } from './entities/configuration-param.entity';
import { ConfigurationNamespaceRepository } from './repositories/configuration-namespace.repository';
import { ConfigurationParamRepository } from './repositories/configuration-param.repository';
import { ConfigurationNamespaceService } from './services/configuration-namespace.service';
import { ConfigurationParamService } from './services/configuration-param.service';
import {
  CONFIGURATION_NAMESPACES,
  configurationNamespacesRegistry,
} from './enums/configuration-namespaces.registry';

@Module({
  providers: [
    ConfigurationNamespaceRepository,
    ConfigurationParamRepository,
    ConfigurationNamespaceService,
    ConfigurationParamService,
    {
      provide: CONFIGURATION_NAMESPACES,
      useValue: configurationNamespacesRegistry,
    },
  ],
  exports: [
    ConfigurationNamespaceRepository,
    ConfigurationParamRepository,
    ConfigurationNamespaceService,
    ConfigurationParamService,
    CONFIGURATION_NAMESPACES,
  ],
  imports: [
    TypeOrmModule.forFeature([
      ConfigurationNamespaceEntity,
      ConfigurationParamEntity,
    ]),
  ],
})
export class ConfigurationsModule {}
