import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Priority } from '../type/goal';

@Entity('goals')
export class Goal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  title: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  target_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  current_amount: number;

  @Column()
  deadline: Date;

  @Column()
  description: string;

  @Column()
  priority: Priority;
}
