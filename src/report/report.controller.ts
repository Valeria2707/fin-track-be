import { Controller, Get, Res, HttpException, HttpStatus, Query, Req, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { Response } from 'express';
import { Request } from 'express';
import * as fs from 'fs';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseGetReport } from './dto/response-get-report';
import { AccessTokenGuard } from 'src/guards/access-token.guard';

@UseGuards(AccessTokenGuard)
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
  @Get('generate')
  async generateReport(@Query('from') from: string, @Query('to') to: string, @Req() req: Request, @Res() res?: Response) {
    const userId = req.user['sub'];
    const filePath = await this.reportsService.generateExcelReport(userId, from, to);
    res.download(filePath, err => {
      if (err) {
        throw new HttpException('Failed to download file', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      fs.unlinkSync(filePath);
    });
  }
}
