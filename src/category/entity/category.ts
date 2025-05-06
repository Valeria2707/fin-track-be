import { Transaction } from '../../transaction/entity/transaction';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  name: string;

  @OneToMany(() => Transaction, transaction => transaction.category)
  transactions: Transaction[];
}
