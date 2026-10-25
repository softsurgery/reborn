import { Injectable } from '@nestjs/common';
import { JobUploadRepository } from '../repositories/job-upload.repository';
import { JobUploadEntity } from '../entities/job-upload.entity';
import { StorageService } from '@softsurgery/nsa-storage/services/storage.service';
import { AbstractCrudService } from '@softsurgery/nsa-database';

@Injectable()
export class JobUploadService extends AbstractCrudService<JobUploadEntity> {
  constructor(
    private readonly jobUploadRepository: JobUploadRepository,
    private readonly storageService: StorageService,
  ) {
    super(jobUploadRepository);
  }
}
