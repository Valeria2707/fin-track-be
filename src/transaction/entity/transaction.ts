import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../../category/entity/category';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  type: string;

  @Column('decimal')
  amount: number;

  @Column('timestamp')
  date: Date;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false })
  category_id: number;

  @ManyToOne(() => Category, category => category.transactions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
