import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Category } from './category/entity/category';
import { Transaction } from './transaction/entity/transaction';
import { User } from './user/entity/user';
import { Goal } from './goal/entity/goal';
import { AiQuery } from './ai-queries/entity/ai-query';

const isDev = process.env.NODE_ENV === 'development';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: isDev,
  entities: [Category, Transaction, User, Goal, AiQuery],
  migrations: [isDev ? 'src/migration/**/*.{ts,js}' : 'dist/migration/**/*.{js,ts}'],
  migrationsTableName: 'migrations',
});

export default AppDataSource;
