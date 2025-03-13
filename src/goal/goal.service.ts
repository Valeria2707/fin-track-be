import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Client } from 'pg';
import { IGoal } from './interface/goal';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalService {
  constructor(@Inject('PG_CLIENT') private readonly client: Client) {}

  async addGoal(goalData: CreateGoalDto): Promise<IGoal> {
    const query = `
      INSERT INTO goals (user_id, title, target_amount, current_amount, deadline, description, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [
      goalData.user_id,
      goalData.title,
      goalData.target_amount,
      goalData.current_amount || 0,
      goalData.deadline,
      goalData.description,
      goalData.status || 'in-progress',
    ];
    const result = await this.client.query(query, values);
    return result.rows[0];
  }

  async getAllGoals(userId: string): Promise<IGoal[]> {
    const query = 'SELECT * FROM goals WHERE user_id = $1';
    const result = await this.client.query(query, [userId]);
    return result.rows;
  }

  async getGoalById(id: number): Promise<IGoal> {
    const query = 'SELECT * FROM goals WHERE id = $1';
    const result = await this.client.query(query, [id]);
    if (result.rows.length === 0) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }
    return result.rows[0];
  }

  async updateGoal(id: number, updates: UpdateGoalDto): Promise<IGoal> {
    const query = `
      UPDATE goals
      SET title = COALESCE($2, title),
          target_amount = COALESCE($3, target_amount),
          current_amount = COALESCE($4, current_amount),
          deadline = COALESCE($5, deadline),
          description = COALESCE($6, description),
          status = COALESCE($7, status)
      WHERE id = $1
      RETURNING *;
    `;
    const values = [
      id,
      updates.title,
      updates.target_amount,
      updates.current_amount,
      updates.deadline,
      updates.description,
      updates.status,
    ];
    const result = await this.client.query(query, values);
    if (result.rows.length === 0) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }
    return result.rows[0];
  }

  async removeGoal(id: number): Promise<void> {
    const query = 'DELETE FROM goals WHERE id = $1';
    const result = await this.client.query(query, [id]);
    if (result.rowCount === 0) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }
  }

  async calculateGoalProgress(id: number): Promise<{ progress: number }> {
    const goal = await this.getGoalById(id);
    const progress = (goal.current_amount / goal.target_amount) * 100;
    return { progress: Math.min(progress, 100) };
  }
}
