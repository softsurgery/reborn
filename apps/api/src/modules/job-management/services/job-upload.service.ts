import { Injectable } from '@nestjs/common';
import { JobUploadRepository } from '../repositories/job-upload.repository';
import { JobUploadEntity } from '../entities/job-upload.entity';
import { StorageService } from 'nsa-storage/services/storage.service';
import { AbstractCrudService } from 'nsa-database';

@Injectable()
export class JobUploadService extends AbstractCrudService<JobUploadEntity> {
  constructor(
    private readonly jobUploadRepository: JobUploadRepository,
    private readonly storageService: StorageService,
  ) {
    super(jobUploadRepository);
  }
}
