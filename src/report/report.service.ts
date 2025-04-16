import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import { Transaction } from 'src/transaction/entity/transaction';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { formatDate, getMonthRange } from 'src/utils/date';
import { Cron } from '@nestjs/schedule';
import { User } from 'src/user/entity/user';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly emailService: EmailService,
  ) {}

  async generateExcelReport(userId: string, from: string | Date, to: string | Date): Promise<string> {
    const result = await this.transactionRepo
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.category', 'category')
      .where('transaction.user_id = :userId', { userId })
      .andWhere('transaction.date BETWEEN :from AND :to', { from, to })
      .orderBy('transaction.date', 'ASC')
      .getMany();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transactions Report');

    worksheet.columns = [
      { header: '№', key: 'number', width: 10 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Category', key: 'category_name', width: 20 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Description', key: 'description', width: 30 },
    ];

    worksheet.addRows(
      result.map((t, index) => ({
        number: index + 1,
        type: t.type,
        category_name: t.category?.name || 'Unknown',
        amount: t.amount,
        date: formatDate(t.date),
        description: t.description,
      })),
    );

    const reportsDir = path.resolve(__dirname, '../../reports');

    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);
    const filePath = path.join(reportsDir, `transactions_report_${formatDate(from)}-to-${formatDate(to)}.xlsx`);
    await workbook.xlsx.writeFile(filePath);

    return filePath;
  }

  @Cron('*/30 * * * * *')
  async handleMonthlyReports() {
    const { fromDate, toDate } = getMonthRange(-1);
    const users = await this.userRepo.find({ select: ['id', 'email'] });

    for (const u of users) {
      const filePath = await this.generateExcelReport(u.id, fromDate, toDate);

      await this.emailService.sendEmailWithAttachment(u.email, filePath);
    }
  }
}
