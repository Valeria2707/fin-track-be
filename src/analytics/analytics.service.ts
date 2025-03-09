import { Injectable, Inject } from '@nestjs/common';
import { Client } from 'pg';
import {
  ResponseGetExpensesByCategoryDto,
  ResponseGetIncomeVsExpensesDto,
  ResponseGetMonthlyAnalyticsDto,
} from './dto';

@Injectable()
export class AnalyticsService {
  constructor(@Inject('PG_CLIENT') private readonly client: Client) {}

  async getExpensesByCategory(
    userId: string,
  ): Promise<ResponseGetExpensesByCategoryDto[]> {
    const query = `
      SELECT c.name AS category, COALESCE(SUM(t.amount), 0) AS total
      FROM categories c
      LEFT JOIN transactions t ON t.category_id = c.id AND t.user_id = $1 AND t.type = 'expense'
      GROUP BY c.name
      ORDER BY total DESC;
    `;
    const result = await this.client.query(query, [userId]);
    return result.rows.map(row => ({
      category: row.category,
      total: parseFloat(row.total) || 0,
    }));
  }

  async getIncomeVsExpenses(
    userId: string,
  ): Promise<ResponseGetIncomeVsExpensesDto> {
    const query = `
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expenses
      FROM transactions
      WHERE user_id = $1;
    `;
    const result = await this.client.query(query, [userId]);
    return result.rows[0];
  }

  async getMonthlyAnalytics(
    userId: string,
    year: number,
  ): Promise<ResponseGetMonthlyAnalyticsDto> {
    const query = `
      SELECT 
        EXTRACT(MONTH FROM date) AS month,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
      FROM transactions
      WHERE user_id = $1 AND EXTRACT(YEAR FROM date) = $2
      GROUP BY month
      ORDER BY month ASC;
    `;
    const result = await this.client.query(query, [userId, year]);
    return result.rows;
  }
}
