import { MigrationInterface, QueryRunner, In } from 'typeorm';

export class SeedCategories1746800425889 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const categories = [
      { type: 'income', name: 'Salary' },
      { type: 'income', name: 'Freelancing' },
      { type: 'income', name: 'Investments' },
      { type: 'income', name: 'Bonus' },
      { type: 'expense', name: 'Rent' },
      { type: 'expense', name: 'Groceries' },
      { type: 'expense', name: 'Utilities' },
      { type: 'expense', name: 'Entertainment' },
    ];

    await queryRunner.manager.insert('categories', categories);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete('categories', {
      name: In(['Salary', 'Freelancing', 'Investments', 'Bonus', 'Rent', 'Groceries', 'Utilities', 'Entertainment']),
    });
  }
}
