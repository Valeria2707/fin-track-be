import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { Client } from 'pg';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ReportService {
  constructor(
    @Inject('PG_CLIENT') private readonly client: Client,
    private readonly categoryService: CategoryService,
  ) {}

  async generateExcelReport(
    userId: string,
    fromDate?: string,
    toDate?: string,
  ): Promise<string> {
    try {
      let query = 'SELECT * FROM transactions WHERE user_id = $1';
      const params = [userId];

      if (fromDate && toDate) {
        query += ' AND date BETWEEN $2 AND $3';
        params.push(fromDate, toDate);
      } else if (fromDate) {
        query += ' AND date >= $2';
        params.push(fromDate);
      } else if (toDate) {
        query += ' AND date <= $2';
        params.push(toDate);
      }

      query += ' ORDER BY date ASC';

      const result = await this.client.query(query, params);
      const transactions = result.rows;

      if (transactions.length === 0) {
        throw new HttpException(
          'No transactions found for the specified user and period',
          HttpStatus.NOT_FOUND,
        );
      }

      const uniqueCategoryIds = [
        ...new Set(transactions.map(t => t.category_id)),
      ];
      const categories = await Promise.all(
        uniqueCategoryIds.map(id => this.categoryService.findOne(id as number)),
      );
      const categoryMap = Object.fromEntries(
        categories.map(c => [c.id, c.name]),
      );

      transactions.forEach(transaction => {
        transaction.category_name =
          categoryMap[transaction.category_id] || 'Unknown';
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Transactions Report');

      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Type', key: 'type', width: 15 },
        { header: 'Category', key: 'category_name', width: 20 },
        { header: 'Amount', key: 'amount', width: 15 },
        { header: 'Date', key: 'date', width: 20 },
        { header: 'Description', key: 'description', width: 30 },
      ];
      worksheet.addRows(transactions);

      const reportsDir = path.resolve(__dirname, '../../reports');
      if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);
      const filePath = path.join(
        reportsDir,
        `transactions_report_${userId}.xlsx`,
      );
      await workbook.xlsx.writeFile(filePath);

      return filePath;
    } catch (error) {
      console.error('Error generating report:', error.message);
      throw new HttpException(
        'Failed to generate report',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
