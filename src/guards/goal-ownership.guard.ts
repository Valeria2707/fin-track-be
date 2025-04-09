import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GoalService } from 'src/goal/goal.service';

@Injectable()
export class GoalOwnershipGuard implements CanActivate {
  constructor(private readonly goalService: GoalService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.sub;
    const goalId = Number(request.params.id);

    if (!goalId || !userId) {
      return false;
    }

    const goal = await this.goalService.getGoalById(goalId);

    if (!goal || goal.user_id !== userId) {
      return false;
    }

    return true;
  }
}
