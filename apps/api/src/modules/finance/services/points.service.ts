import { Injectable, BadRequestException } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { PointTransactionRepository } from '../repositories/point-transaction.repository';
import { UserRepository } from 'src/modules/users/repositories/user.repository';
import {
  IQueryObject,
} from '@softsurgery/nsa-database';
import {
  QueryBuilder,
} from '@softsurgery/nsa-database';
import {
  PageDto,
} from '@softsurgery/nsa-database';
import {
  PageMetaDto,
} from '@softsurgery/nsa-database';
import { FindManyOptions } from 'typeorm';
import { PointTransactionEntity } from '../entities/point-transaction.entity';
import { TransactionType } from '../enums/transaction-type.enum';
import { mergeWhereConditions } from 'src/utils/merge-where-conditions';

@Injectable()
export class PointsService {
  constructor(
    private readonly pointTransactionRepository: PointTransactionRepository,
    private readonly userRepository: UserRepository,
  ) {}

  @Transactional()
  async addPoints(
    userId: string,
    amount: number,
    type?: TransactionType,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.points += amount;
    await this.userRepository.update(user.id, { points: user.points });

    await this.pointTransactionRepository.save({
      userId,
      amount,
      type,
      metadata,
    });
  }

  @Transactional()
  async deductPoints(
    userId: string,
    amount: number,
    type?: TransactionType,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.points < amount) {
      throw new BadRequestException('Not enough points');
    }

    user.points -= amount;
    await this.userRepository.update(user.id, { points: user.points });

    await this.pointTransactionRepository.save({
      userId,
      amount,
      type,
      metadata,
    });
  }

  async getTransactions(
    userId: string,
    query: IQueryObject,
  ): Promise<PageDto<PointTransactionEntity>> {
    const queryBuilder = new QueryBuilder(
      this.pointTransactionRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    queryOptions.where = mergeWhereConditions(queryOptions.where, { userId });
    queryOptions.order = { createdAt: 'DESC' }; // Most recent first

    const count = await this.pointTransactionRepository.getTotalCount({
      where: queryOptions.where,
    });
    const entities = await this.pointTransactionRepository.findAll(
      queryOptions as FindManyOptions<PointTransactionEntity>,
    );

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: { page: Number(query.page), take: Number(query.limit) },
      itemCount: count,
    });

    return new PageDto(entities, pageMetaDto);
  }
}
