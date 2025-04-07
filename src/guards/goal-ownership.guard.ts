import { CanActivate, ExecutionContext, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { GoalService } from 'src/goal/goal.service';

@Injectable()
export class GoalOwnershipGuard implements CanActivate {
  constructor(private readonly goalService: GoalService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.sub;
    const goalId = Number(request.params.id);

    if (!goalId || !userId) {
      throw new ForbiddenException('Invalid goal or user.');
    }

    const goal = await this.goalService.getGoalById(goalId);

    if (!goal) {
      throw new NotFoundException(`Goal with ID ${goalId} not found`);
    }

    if (goal.user_id !== userId) {
      throw new ForbiddenException(`You do not have access to this goal`);
    }

    return true;
  }
}
