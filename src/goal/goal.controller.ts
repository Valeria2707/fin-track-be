import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { GoalService } from './goal.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateGoalDto,
  ResponseGetCalculatedGoalProgressDto,
  ResponseGoalDto,
  ResponseRemoveGoalDto,
  UpdateGoalDto,
} from './dto';

@ApiTags('Goals')
@Controller('goals')
export class GoalController {
  constructor(private readonly goalsService: GoalService) {}

  @ApiOperation({ summary: 'Create goal.' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseGoalDto,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post()
  async addGoal(@Body() goalData: CreateGoalDto) {
    return this.goalsService.addGoal(goalData);
  }

  @ApiOperation({ summary: 'Get all goals.' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseGoalDto,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get('all/:userId')
  async getAllGoals(@Param('userId') userId: string) {
    return this.goalsService.getAllGoals(userId);
  }

  @ApiOperation({ summary: 'Get goal by id.' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseGoalDto,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get(':id')
  async getGoalById(@Param('id') id: number) {
    return this.goalsService.getGoalById(id);
  }

  @ApiOperation({ summary: 'Update goal.' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseGoalDto,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Put(':id')
  async updateGoal(@Param('id') id: number, @Body() updates: UpdateGoalDto) {
    return this.goalsService.updateGoal(id, updates);
  }

  @ApiOperation({ summary: 'Remove goal.' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseRemoveGoalDto,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Delete(':id')
  async removeGoal(@Param('id') id: number) {
    await this.goalsService.removeGoal(id);
    return { message: 'Goal removed successfully' };
  }

  @ApiOperation({ summary: 'Get calculated goals progress.' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseGetCalculatedGoalProgressDto,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get('progress/:id')
  async calculateGoalProgress(@Param('id') id: number) {
    return this.goalsService.calculateGoalProgress(id);
  }
}
