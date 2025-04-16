import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseDailyTransactionsDto, ResponseGetCountOfTransactionsDto, ResponseGetExpensesByCategoryDto, ResponseGetIncomeVsExpensesDto } from './dto';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { DateQueryDto } from './dto/date.dto';

@UseGuards(AccessTokenGuard)
@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @ApiOperation({ summary: 'Get expenses by category.' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseGetExpensesByCategoryDto,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get('/expenses-by-category')
  async getExpensesByCategory(@Req() req: Request, @Query() query: DateQueryDto) {
    const userId = req.user['sub'];
    const { from, to } = query;

    return this.analyticsService.getCategoryAnalytics(userId, from, to);
  }
  @ApiOperation({ summary: 'Get income vs expenses.' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseGetIncomeVsExpensesDto,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get('/income-vs-expenses')
  async getIncomeVsExpenses(@Req() req: Request, @Query() query: DateQueryDto) {
    const userId = req.user['sub'];
    const { from, to } = query;

    return this.analyticsService.getIncomeVsExpenses(userId, from, to);
  }

  @ApiOperation({ summary: 'Get count of transactions.' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseGetCountOfTransactionsDto,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get('/count-of-transactions')
  async getCountOfTransactions(@Req() req: Request, @Query() query: DateQueryDto) {
    const userId = req.user['sub'];
    const { from, to } = query;
    return this.analyticsService.getCountOfTransactions(userId, from, to);
  }

  @ApiOperation({ summary: 'Get daily trend.' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseDailyTransactionsDto,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get('/daily-trend')
  async getDailyTrend(@Req() req: Request, @Query() query: DateQueryDto) {
    const userId = req.user['sub'];
    const { from, to } = query;

    return this.analyticsService.getDailyTrend(userId, from, to);
  }
}
