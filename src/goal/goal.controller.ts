import { Controller, Post, Get, Put, Delete, Param, Body, Req, NotFoundException, UseGuards } from '@nestjs/common';
import { GoalService } from './goal.service';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateGoalDto, ResponseGoalDto, ResponseOrderGoalDto, ResponseRemoveGoalDto, UpdateGoalDto } from './dto';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { GoalOwnershipGuard } from 'src/guards/goal-ownership.guard';
@UseGuards(AccessTokenGuard)
@ApiTags('Goals')
@Controller('goals')
export class GoalController {
  constructor(private readonly goalsService: GoalService) {}

  @ApiOperation({ summary: 'Create goal.' })
  @ApiCreatedResponse({
    description: 'Created Successfully',
    type: ResponseGoalDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post()
  async addGoal(@Body() goalData: CreateGoalDto, @Req() req: Request) {
    const userId = req.user['sub'];
    return this.goalsService.addGoal({ ...goalData, user_id: userId });
  }

  @ApiOperation({ summary: 'Get all goals for logged-in user.' })
  @ApiCreatedResponse({
    description: 'Fetched Successfully',
    type: ResponseGoalDto,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get()
  async getAllGoals(@Req() req: Request) {
    const userId = req.user['sub'];
    return this.goalsService.getAllGoals(userId);
  }

  @ApiOperation({ summary: 'Get goal IDs ordered by global AHP weight.' })
  @ApiCreatedResponse({
    description: 'Goals ordered successfully by global weight',
    type: ResponseOrderGoalDto,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get('order-by-weight')
  async getGoalsOrderByGlobalWeight(@Req() req: Request) {
    const userId = req.user['sub'];
    return this.goalsService.getGoalsWithRecommendedSum(userId);
  }

  @ApiOperation({ summary: 'Get goal by id.' })
  @ApiCreatedResponse({
    description: 'Fetched Successfully',
    type: ResponseGoalDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @UseGuards(GoalOwnershipGuard)
  @Get(':id')
  async getGoalById(@Param('id') id: number) {
    const goal = await this.goalsService.getGoalById(id);
    if (!goal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }
    return goal;
  }

  @ApiOperation({ summary: 'Update goal.' })
  @ApiCreatedResponse({
    description: 'Updated Successfully',
    type: ResponseGoalDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @UseGuards(GoalOwnershipGuard)
  @Put(':id')
  async updateGoal(@Param('id') id: number, @Body() updates: UpdateGoalDto) {
    const updatedGoal = await this.goalsService.updateGoal(id, updates);
    if (!updatedGoal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }
    return updatedGoal;
  }

  @ApiOperation({ summary: 'Remove goal.' })
  @ApiCreatedResponse({
    description: 'Removed Successfully',
    type: ResponseRemoveGoalDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @UseGuards(GoalOwnershipGuard)
  @Delete(':id')
  async removeGoal(@Param('id') id: number) {
    const isDeleted = await this.goalsService.removeGoal(id);

    if (!isDeleted) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }

    return { message: `Goal with ID ${id} deleted successfully` };
  }
}
