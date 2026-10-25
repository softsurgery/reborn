import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageRepository } from './repositories/storage.repository';
import { StorageEntity } from './entities/storage.entity';
import { StorageFolderEntity } from './entities/storage-folder.entity';
import { StorageFolderRepository } from './repositories/storage-folder.repository';
import { StorageFolderService } from './services/storage-folder.service';
import { storageProvider } from './providers/storage.provider';
import { ConfigModule } from '@nestjs/config';
import {
  STORAGE_SYSTEMATICS_TOKEN,
  storageSystematicsRegistry,
} from './constants/storage-systematics.registry';

@Module({
  controllers: [],
  providers: [
    storageProvider,
    StorageRepository,
    StorageFolderRepository,
    StorageFolderService,
    {
      provide: STORAGE_SYSTEMATICS_TOKEN,
      useValue: storageSystematicsRegistry,
    },
  ],
  exports: [storageProvider, StorageFolderService, STORAGE_SYSTEMATICS_TOKEN],
  imports: [
    TypeOrmModule.forFeature([StorageEntity, StorageFolderEntity]),
    ConfigModule,
  ],
})
export class StorageModule {}
