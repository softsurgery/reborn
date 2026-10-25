import { Injectable } from '@nestjs/common';
import { DatabaseAbstractRepository } from '@softsurgery/nsa-database';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { JobSaveEntity } from '../entities/job-save.entity';

@Injectable()
export class JobSaveRepository extends DatabaseAbstractRepository<JobSaveEntity> {
  constructor(
    @InjectRepository(JobSaveEntity)
    private readonly jobSaveRepository: Repository<JobSaveEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(jobSaveRepository, txHost);
  }

  getRelationSearchFields(relationPath: string): string[] {
    const relation =
      this.getMetadata().findRelationWithPropertyPath(relationPath);

    if (!relation) {
      return [];
    }

    return relation.inverseEntityMetadata.columns
      .filter(
        (column) =>
          column.type === String ||
          column.type === 'varchar' ||
          column.type === 'text' ||
          column.type === 'longtext' ||
          column.type === 'mediumtext' ||
          column.type === 'tinytext',
      )
      .map((column) => `${relationPath}.${column.propertyName}`);
  }

  getSearchFields(): string[] {
    return this.getMetadata()
      .relations.filter((relation) => relation.isManyToOne)
      .filter((relation) =>
        relation.inverseEntityMetadata.columns.some(
          (column) => column.propertyName === 'title',
        ),
      )
      .flatMap((relation) =>
        this.getRelationSearchFields(relation.propertyName),
      );
  }

  async findByUserAndJob(
    userId: string,
    jobId: string,
  ): Promise<JobSaveEntity | null> {
    return this.findOne({
      where: { userId, jobId },
    });
  }
}
