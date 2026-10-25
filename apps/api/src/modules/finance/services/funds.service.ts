import { Injectable, BadRequestException } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { FundTransactionRepository } from '../repositories/fund-transaction.repository';
import { FundTransactionEntity } from '../entities/fund-transaction.entity';
import { TransactionType } from '../enums/transaction-type.enum';
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
import { BalanceResponseDto } from '../dtos/balance-response.dto';
import { mergeWhereConditions } from 'src/utils/merge-where-conditions';

@Injectable()
export class FundsService {
  constructor(
    private readonly fundTransactionRepository: FundTransactionRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async findUserBalance(userId: string): Promise<BalanceResponseDto | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'points', 'balance'],
    });
    if (!user) return null;
    return {
      id: user.id,
      points: user.points,
      balance: user.balance,
    };
  }

  @Transactional()
  async addFunds(
    userId: string,
    amount: number,
    type?: TransactionType,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.balance = Number(user.balance) + Number(amount);
    await this.userRepository.update(user.id, { balance: user.balance });

    await this.fundTransactionRepository.save({
      userId,
      amount,
      type,
      metadata,
    });
  }

  @Transactional()
  async deductFunds(
    userId: string,
    amount: number,
    type?: TransactionType,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.balance < amount) {
      throw new BadRequestException('Not enough funds');
    }

    user.balance = Number(user.balance) - Number(amount);
    await this.userRepository.update(user.id, { balance: user.balance });

    await this.fundTransactionRepository.save({
      userId,
      amount,
      type,
      metadata,
    });
  }

  async getFundTransactions(
    userId: string,
    query: IQueryObject,
  ): Promise<PageDto<FundTransactionEntity>> {
    const queryBuilder = new QueryBuilder(
      this.fundTransactionRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    queryOptions.where = mergeWhereConditions(queryOptions.where, { userId });
    queryOptions.order = { createdAt: 'DESC' }; // Most recent first

    const count = await this.fundTransactionRepository.getTotalCount({
      where: queryOptions.where,
    });
    const entities = await this.fundTransactionRepository.findAll(
      queryOptions as FindManyOptions<FundTransactionEntity>,
    );

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: { page: Number(query.page), take: Number(query.limit) },
      itemCount: count,
    });

    return new PageDto(entities, pageMetaDto);
  }
}
