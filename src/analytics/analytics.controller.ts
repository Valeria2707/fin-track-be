import { Controller, Get, Query, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  ResponseGetExpensesByCategoryDto,
  ResponseGetIncomeVsExpensesDto,
  ResponseGetMonthlyAnalyticsDto,
} from './dto';

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
  @Get('expenses-by-category/:userId')
  async getExpensesByCategory(@Param('userId') userId: string) {
    return this.analyticsService.getExpensesByCategory(userId);
  }

  @ApiOperation({ summary: 'Get income vs expenses.' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseGetIncomeVsExpensesDto,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get('income-vs-expenses/:userId')
  async getIncomeVsExpenses(@Param('userId') userId: string) {
    return this.analyticsService.getIncomeVsExpenses(userId);
  }

  @ApiOperation({ summary: 'Get monthly analytics.' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseGetMonthlyAnalyticsDto,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get('monthly/:userId')
  async getMonthlyAnalytics(
    @Param('userId') userId: string,
    @Query('year') year: string,
  ) {
    const yearNumber = parseInt(year, 10);
    if (isNaN(yearNumber)) {
      throw new Error('Invalid year format');
    }
    return this.analyticsService.getMonthlyAnalytics(userId, yearNumber);
  }
}
