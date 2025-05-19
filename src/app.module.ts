import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TransactionModule } from './transaction/transaction.module';
import { CategoryModule } from './category/category.module';
import { AiQueriesModule } from './ai-queries/ai-queries.module';
import { ReportModule } from './report/report.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { GoalModule } from './goal/goal.module';
import { EmailService } from './email/email.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppDataSource from './data-source';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(AppDataSource.options),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    TransactionModule,
    CategoryModule,
    AiQueriesModule,
    ReportModule,
    AnalyticsModule,
    GoalModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}
