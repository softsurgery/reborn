import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { IQueryObject } from 'nsa-database';
import {
  QueryBuilder,
  mergeWhereConditions,
} from 'nsa-database';
import { PageDto } from 'nsa-database';
import { PageMetaDto } from 'nsa-database';
import { UserNotFoundException } from 'nsa-um/errors/user/user.notfound.error';
import { JobViewRepository } from '../repositories/job-view.repository';
import { JobViewEntity } from '../entities/job-view.entity';
import { AbstractCrudService } from 'nsa-database';

@Injectable()
export class JobViewService extends AbstractCrudService<JobViewEntity> {
  constructor(private readonly jobViewRepository: JobViewRepository) {
    super(jobViewRepository);
  }

  async findAllUserPaginated(
    query: IQueryObject,
    userId?: string,
  ): Promise<PageDto<JobViewEntity>> {
    if (!userId) {
      throw new UserNotFoundException();
    }

    const searchFields = this.jobViewRepository.getSearchFields();
    const queryBuilder = new QueryBuilder(
      this.jobViewRepository.getMetadata(),
      {},
      searchFields.length ? searchFields : undefined,
    );

    const queryOptions = queryBuilder.build(query);

    queryOptions.where = mergeWhereConditions(queryOptions.where, { userId });

    const count = await this.jobViewRepository.getTotalCount({
      where: queryOptions.where,
      relations: queryOptions.relations,
    });

    const entities = await this.jobViewRepository.findAll(
      queryOptions as FindManyOptions<JobViewEntity>,
    );

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: {
        page: Number(query.page),
        take: Number(query.limit),
      },
      itemCount: count,
    });

    return new PageDto(entities, pageMetaDto);
  }

  @Transactional()
  async markAsViewed(jobId: string, savedBy?: string): Promise<JobViewEntity> {
    const jobView = await this.jobViewRepository.findOne({
      where: { jobId, userId: savedBy },
    });
    if (!jobView) {
      return await this.jobViewRepository.save({
        jobId,
        userId: savedBy,
      });
    }
    jobView.updatedAt = new Date();
    return await this.jobViewRepository.save(jobView);
  }

  async isJobViewAlreadyExists(
    jobId: string,
    userId?: string,
  ): Promise<JobViewEntity | null> {
    return this.jobViewRepository.findOne({
      where: { jobId, userId },
    });
  }
}
