import { Category } from '../../category/entity/category';
import AppDataSource from '../../data-source';

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

async function seed() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(Category);

  for (const { type, name } of categories) {
    const exists = await repo.findOne({ where: { type, name } });
    if (!exists) {
      const category = repo.create({ type, name });
      await repo.save(category);
    } else {
      console.log(`Already exists: [${type}] ${name}`);
    }
  }

  await AppDataSource.destroy();
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
