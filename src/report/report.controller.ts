import {
  Controller,
  Get,
  Param,
  Res,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { Response } from 'express';
import * as fs from 'fs';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseGetReport } from './dto/response-get-report';

@ApiTags('Report')
@Controller('report')
export class ReportController {
  constructor(private readonly reportsService: ReportService) {}

  @ApiOperation({ summary: 'Get report.' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseGetReport,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get('generate/:userId')
  async generateReport(
    @Param('userId') userId: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Res() res?: Response,
  ) {
    try {
      const filePath = await this.reportsService.generateExcelReport(
        userId,
        fromDate,
        toDate,
      );

      res.download(filePath, err => {
        if (err) {
          console.error('Error sending file:', err.message);
          throw new HttpException(
            'Failed to download file',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        fs.unlinkSync(filePath);
      });
    } catch (error) {
      console.error('Error generating report:', error.message);
      throw new HttpException(
        'Failed to generate report',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
