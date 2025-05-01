import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('ai_queries')
export class AiQuery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  query: string;

  @Column()
  response: string;

  @CreateDateColumn({ type: 'timestamp' })
  date: Date;
}
