import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResponseDailyTransactionsDto, ResponseGetCountOfTransactionsDto, ResponseGetExpensesByCategoryDto, ResponseGetIncomeVsExpensesDto } from './dto';
import { Transaction } from 'src/transaction/entity/transaction';
import { Category } from 'src/category/entity/category';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async getCategoryAnalytics(userId: string, from: Date, to: Date): Promise<ResponseGetExpensesByCategoryDto[]> {
    const results = await this.transactionRepo
      .createQueryBuilder('transaction')
      .leftJoin('transaction.category', 'category')
      .select(['category.name AS category', 'transaction.type AS type', 'SUM(transaction.amount) AS amount'])
      .where('transaction.user_id = :userId AND transaction.date BETWEEN :from AND :to', {
        userId,
        from,
        to,
      })
      .groupBy('category.name, transaction.type')
      .orderBy('amount', 'DESC')
      .getRawMany();

    return results.map(row => ({
      category: row.category,
      type: row.type,
      amount: parseFloat(row.amount),
    }));
  }

  async getIncomeVsExpenses(userId: string, from: Date, to: Date): Promise<ResponseGetIncomeVsExpensesDto> {
    const result = await this.transactionRepo
      .createQueryBuilder('transaction')
      .select([
        `SUM(CASE WHEN transaction.type = 'income' THEN transaction.amount ELSE 0 END) AS income`,
        `SUM(CASE WHEN transaction.type = 'expense' THEN transaction.amount ELSE 0 END) AS expenses`,
      ])
      .where('transaction.user_id = :userId', { userId })
      .andWhere('transaction.date BETWEEN :from AND :to', { from, to })
      .getRawOne();

    const income = +result.income || 0;
    const expenses = +result.expenses || 0;
    const balance = income - expenses;

    return { income, expenses, balance };
  }

  async getCountOfTransactions(userId: string, from: Date, to: Date): Promise<ResponseGetCountOfTransactionsDto> {
    const result = await this.transactionRepo
      .createQueryBuilder('transaction')
      .select([`COUNT(CASE WHEN transaction.type = 'income' THEN 1 END) AS income`, `COUNT(CASE WHEN transaction.type = 'expense' THEN 1 END) AS expenses`])
      .where('transaction.user_id = :userId', { userId })
      .andWhere('transaction.date BETWEEN :from AND :to', { from, to })
      .getRawOne();

    const income = +result.income || 0;
    const expenses = +result.expenses || 0;

    return { income, expenses };
  }

  async getDailyTrend(userId: string, from: Date, to: Date): Promise<ResponseDailyTransactionsDto[]> {
    const result = await this.transactionRepo
      .createQueryBuilder('transaction')
      .select([
        'DATE(transaction.date) AS date',
        `SUM(CASE WHEN transaction.type = 'income' THEN transaction.amount ELSE 0 END) AS income`,
        `SUM(CASE WHEN transaction.type = 'expense' THEN transaction.amount ELSE 0 END) AS expense`,
      ])
      .where('transaction.user_id = :userId', { userId })
      .andWhere('transaction.date BETWEEN :from AND :to', { from, to })
      .groupBy('DATE(transaction.date)')
      .orderBy('DATE(transaction.date)', 'ASC')
      .getRawMany();

    return result.map(row => ({
      date: row.date,
      income: +row.income || 0,
      expense: +row.expense || 0,
    }));
  }
}
