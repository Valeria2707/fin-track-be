export interface IGoal {
  id: number;
  user_id: number;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline: Date;
  description: string;
  status: 'in-progress' | 'completed' | 'cancelled';
}
