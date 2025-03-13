import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { CategoryService } from 'src/category/category.service';

@Module({
  controllers: [ReportController],
  providers: [ReportService, CategoryService],
})
export class ReportModule {}
