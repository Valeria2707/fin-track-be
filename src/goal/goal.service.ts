import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from './entity/goal';
import { buildComparisonMatrix, computeAHPMetrics, distributeRecommendedSum, getDeadlineLabel, getTargetAmountLabel } from './helpers/goal';
import { AHP_CR_THRESHOLD, criteriaComparisonMatrix } from './constants/goal';
import { TransactionService } from 'src/transaction/transaction.service';
import { DEADLINE_WEIGHTS, PRIORITY_WEIGHTS, RecommendedGoal, TARGET_AMOUNT_WEIGHTS } from './type/goal';

@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
    private readonly transactionService: TransactionService,
  ) {}

  async addGoal(goalData: CreateGoalDto, userId: string): Promise<Goal> {
    const goal = this.goalRepository.create({ ...goalData, userId });
    return this.goalRepository.save(goal);
  }

  async getAllGoals(userId: string): Promise<Goal[]> {
    return this.goalRepository.find({
      where: { userId },
      order: { deadline: 'ASC' },
    });
  }

  async getGoalById(id: number): Promise<Goal> {
    return this.goalRepository.findOne({ where: { id } });
  }

  async updateGoal(id: number, updates: UpdateGoalDto): Promise<Goal | null> {
    const goal = await this.getGoalById(id);
    if (!goal) return null;

    const updatedGoal = this.goalRepository.merge(goal, updates);
    return this.goalRepository.save(updatedGoal);
  }

  async removeGoal(id: number): Promise<boolean> {
    const result = await this.goalRepository.delete(id);
    return result.affected !== 0;
  }

  async getComparisonMatrices(userId: string) {
    const goals = await this.getAllGoals(userId);

    const deadlines = goals.map(goal => getDeadlineLabel(new Date(goal.deadline)));
    const targetAmounts = goals.map(goal => getTargetAmountLabel(goal.target_amount));
    const priorities = goals.map(goal => goal.priority);

    const deadlineMatrix = buildComparisonMatrix(deadlines, DEADLINE_WEIGHTS);
    const targetAmountMatrix = buildComparisonMatrix(targetAmounts, TARGET_AMOUNT_WEIGHTS);
    const priorityMatrix = buildComparisonMatrix(priorities, PRIORITY_WEIGHTS);

    return {
      priorityMatrix,
      targetAmountMatrix,
      deadlineMatrix,
    };
  }

  async getAllWeights(userId: string) {
    const { deadlineMatrix, targetAmountMatrix, priorityMatrix } = await this.getComparisonMatrices(userId);

    const priorityAHP = computeAHPMetrics(priorityMatrix);
    const targetAmountAHP = computeAHPMetrics(targetAmountMatrix);
    const deadlineAHP = computeAHPMetrics(deadlineMatrix);
    const criteriaAHP = computeAHPMetrics(criteriaComparisonMatrix);

    const allCR = [priorityAHP.CR, targetAmountAHP.CR, deadlineAHP.CR, criteriaAHP.CR];

    const isConsistent = allCR.every(cr => cr <= AHP_CR_THRESHOLD);
    if (!isConsistent) {
      return {
        message: `Some matrices have CR > ${AHP_CR_THRESHOLD} (too inconsistent). Please adjust the comparisons.`,
        priority: priorityAHP,
        targetAmount: targetAmountAHP,
        deadline: deadlineAHP,
        criteria: criteriaAHP,
      };
    }

    const [priorityWeight, targetAmountWeight, deadlineWeight] = criteriaAHP.weights;
    const [priorityWeights, targetAmountWeights, deadlineWeights] = [priorityAHP.weights, targetAmountAHP.weights, deadlineAHP.weights];

    const globalGoalWeights = priorityWeights.map(
      (_, i) => priorityWeight * priorityWeights[i] + targetAmountWeight * targetAmountWeights[i] + deadlineWeight * deadlineWeights[i],
    );

    return {
      priority: priorityAHP,
      targetAmount: targetAmountAHP,
      deadline: deadlineAHP,
      criteria: criteriaAHP,
      globalGoalWeights,
    };
  }

  async getGoalsWithRecommendedSum(userId: string) {
    const goals = await this.getAllGoals(userId);
    const { globalGoalWeights } = await this.getAllWeights(userId);

    if (!globalGoalWeights) return [];

    const leftover = await this.transactionService.getMonthlyLeftover(userId);

    const shouldZeroOut = leftover <= 0;

    const recommended: RecommendedGoal[] = goals
      .map((goal, i) => ({
        goal,
        recommendedSum: shouldZeroOut ? 0 : +(globalGoalWeights[i] * leftover).toFixed(2),
      }))
      .sort((a, b) => b.recommendedSum - a.recommendedSum);

    const distributed = distributeRecommendedSum(recommended);

    return distributed;
  }
}
