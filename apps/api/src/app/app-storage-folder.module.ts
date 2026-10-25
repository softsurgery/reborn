import { Module } from '@nestjs/common';
import { StorageModule } from '@softsurgery/nsa-storage/storage.module';
import { StorageFolderCatalogService } from './services/storage-folder-catalog.service';
import { StorageFolderModule } from 'src/modules/storage-folder/storage-folder.module';

@Module({
  imports: [StorageFolderModule, StorageModule],
  providers: [StorageFolderCatalogService],
  exports: [StorageFolderCatalogService],
})
export class AppStorageFolderModule {}
