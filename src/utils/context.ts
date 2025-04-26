import { Transaction } from 'src/transaction/entity/transaction';

export const buildTransactionContext = (transactions: Transaction[]) =>
  transactions.map(({ type, amount, category }) => ({
    type,
    amount,
    category: category.name,
  }));
