import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/transaction/entity/transaction';
import { UserModule } from 'src/user/user.module';
import { EmailService } from 'src/email/email.service';
import { User } from 'src/user/entity/user';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User]), UserModule],
  controllers: [ReportController],
  providers: [ReportService, EmailService],
  exports: [ReportService],
})
export class ReportModule {}
