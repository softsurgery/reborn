import { Injectable } from '@nestjs/common';
import { SessionEntity } from '../entities/session.entity';
import { AbstractCrudService } from 'nsa-database';
import { SessionRepository } from '../repositories/session.repository';
import {
  QueryBuilder,
  mergeWhereConditions,
} from 'nsa-database';
import { IWhereClause } from 'nsa-database';
import { IQueryObject } from 'nsa-database';
import { PageDto } from 'nsa-database';
import {
  FindManyOptions,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import { PageMetaDto } from 'nsa-database';
import { ModuleRef } from '@nestjs/core';
import {
  USER_SERVICE,
  AppUserService,
} from 'nsa-um/tokens/user-access';
import { UserNotFoundException } from 'nsa-um/errors/user/user.notfound.error';

@Injectable()
export class SessionService extends AbstractCrudService<SessionEntity> {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly moduleRef: ModuleRef,
  ) {
    super(sessionRepository);
  }

  private get userService(): AppUserService {
    return this.moduleRef.get<AppUserService>(USER_SERVICE, { strict: false });
  }

  getActiveCondition(extraConditions: IWhereClause = {}, userId?: string) {
    const now = new Date();
    const conditions = Array.isArray(extraConditions)
      ? extraConditions
      : [extraConditions];

    return conditions.flatMap((extra) => [
      {
        ...extra,
        ended: IsNull(),
        started: LessThanOrEqual(now),
        ...(userId && { userId }),
      },
      {
        ...extra,
        ended: IsNull(),
        planned_start: LessThanOrEqual(now),
        planned_end: MoreThanOrEqual(now),
        ...(userId && { userId }),
      },
    ]);
  }

  async findAllPaginatedActiveUserSessions(
    query: IQueryObject,
    userId?: string,
  ): Promise<PageDto<SessionEntity>> {
    const queryBuilder = new QueryBuilder(this.sessionRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    queryOptions.where = this.getActiveCondition(queryOptions.where, userId);
    const count = await this.sessionRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.sessionRepository.findAll(
      queryOptions as FindManyOptions<SessionEntity>,
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

  async findAllPaginatedUserSessions(
    query: IQueryObject,
    userId?: string,
  ): Promise<PageDto<SessionEntity>> {
    const queryBuilder = new QueryBuilder(this.sessionRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    queryOptions.where = mergeWhereConditions(queryOptions.where, { userId });
    const count = await this.sessionRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.sessionRepository.findAll(
      queryOptions as FindManyOptions<SessionEntity>,
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

  async findAllActiveUserSessions(
    query: IQueryObject,
    userId?: string,
  ): Promise<SessionEntity[]> {
    const queryBuilder = new QueryBuilder(this.sessionRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    return this.sessionRepository.findAll({
      where: this.getActiveCondition(queryOptions.where, userId),
    });
  }

  async findAllUserSessions(
    query: IQueryObject,
    userId?: string,
  ): Promise<SessionEntity[]> {
    const queryBuilder = new QueryBuilder(this.sessionRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    queryOptions.where = mergeWhereConditions(queryOptions.where, { userId });
    return this.sessionRepository.findAll(
      queryOptions as FindManyOptions<SessionEntity>,
    );
  }

  async create(
    dto: Partial<SessionEntity>,
    userId?: string,
  ): Promise<SessionEntity> {
    if (!userId) throw new Error('User id is required');
    const user = await this.userService.findOneById(userId);
    if (!user) throw new UserNotFoundException();

    return this.sessionRepository.save({ ...dto, userId });
  }
}
