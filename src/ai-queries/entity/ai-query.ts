import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('ai_queries')
export class AiQuery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: string;

  @Column()
  query: string;

  @Column()
  response: string;

  @CreateDateColumn({ type: 'timestamp' })
  date: Date;
}
