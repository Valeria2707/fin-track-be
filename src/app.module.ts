import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { TransactionModule } from './transaction/transaction.module';
import { CategoryModule } from './category/category.module';
import { ReminderModule } from './reminder/reminder.module';
import { AiQueriesModule } from './ai-queries/ai-queries.module';
import { ReportModule } from './report/report.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { GoalModule } from './goal/goal.module';
import { EmailService } from './email/email.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    AuthModule,
    TransactionModule,
    CategoryModule,
    // ReminderModule,
    // AiQueriesModule,
    // ReportModule,
    // AnalyticsModule,
    GoalModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}
