import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entity/transaction';
import { getCurrentMonthRange } from 'src/utils/date';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, userId: string): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      user_id: userId,
      category: { id: createTransactionDto.category_id },
    });

    return await this.transactionRepository.save(transaction);
  }

  async findAll(
    userId: string,
    type?: string,
    category_id?: number,
    fromDate?: Date,
    toDate?: Date,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Transaction[]; total: number; page: number; limit: number }> {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.category', 'category')
      .where('transaction.user_id = :userId', { userId });

    if (type) {
      queryBuilder.andWhere('transaction.type = :type', { type });
    }

    if (category_id) {
      queryBuilder.andWhere('transaction.category_id = :category_id', { category_id });
    }

    if (fromDate) {
      queryBuilder.andWhere('transaction.date >= :fromDate', { fromDate });
    }

    if (toDate) {
      queryBuilder.andWhere('transaction.date <= :toDate', { toDate });
    }

    const total = await queryBuilder.getCount();

    queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('transaction.date', 'DESC');

    const data = await queryBuilder.getMany();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Transaction | null> {
    return this.transactionRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto): Promise<Transaction | null> {
    const transaction = await this.transactionRepository.preload({
      id,
      ...updateTransactionDto,
    });

    if (!transaction) return null;

    return await this.transactionRepository.save(transaction);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.transactionRepository.delete(id);
    return result.affected !== 0;
  }

  async getMonthlyLeftover(userId: string): Promise<number> {
    const { fromDate, toDate } = getCurrentMonthRange();

    const transactions = await this.findAll(userId, undefined, undefined, fromDate, toDate, 1, 9999);

    return transactions.data.reduce((total, t) => {
      const amount = Number(t.amount);
      return t.type === 'income' ? total + amount : total - amount;
    }, 0);
  }
}
