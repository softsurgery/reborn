import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '@softsurgery/nsa-storage/storage.module';
import { StorageEntity } from '@softsurgery/nsa-storage/entities/storage.entity';
import { StorageRepository } from '@softsurgery/nsa-storage/repositories/storage.repository';
import { StorageFolderEntity } from './entities/storage-folder.entity';
import { StorageFolderRepository } from './repositories/storage-folder.repository';
import { StorageFolderService } from './services/storage-folder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StorageFolderEntity, StorageEntity]),
    StorageModule,
  ],
  providers: [
    StorageFolderRepository,
    StorageFolderService,
    StorageRepository,
  ],
  exports: [StorageFolderRepository, StorageFolderService, TypeOrmModule],
})
export class StorageFolderModule {}
