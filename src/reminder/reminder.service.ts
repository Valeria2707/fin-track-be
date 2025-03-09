import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { Client } from 'pg';
import { IReminder } from './interface/reminder';

@Injectable()
export class ReminderService {
  constructor(@Inject('PG_CLIENT') private readonly client: Client) {}
  async create(createReminderDto: CreateReminderDto): Promise<IReminder> {
    const query = `
      INSERT INTO reminders 
        (message, reminder_date, type, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [
      createReminderDto.message,
      createReminderDto.reminder_date,
      createReminderDto.type,
      createReminderDto.user_id,
    ];

    const result = await this.client.query(query, values);

    if (!result.rows.length) {
      throw new Error('Failed to create reminder');
    }

    return result.rows[0];
  }

  async findAll(): Promise<IReminder[]> {
    const result = await this.client.query('SELECT * FROM reminders');
    return result.rows;
  }

  async findOne(id: number): Promise<IReminder> {
    const result = await this.client.query(
      'SELECT * FROM reminders WHERE id = $1',
      [id],
    );
    if (!result.rows.length) {
      throw new NotFoundException(`Reminder with ID ${id} not found`);
    }

    return result.rows[0];
  }

  async remove(id: number): Promise<void> {
    const query = `
      DELETE FROM reminders
      WHERE id = $1
    `;
    const values = [id];

    const result = await this.client.query(query, values);
    if (result.rowCount === 0) {
      throw new NotFoundException(`Reminder with id ${id} not found`);
    }
  }
}
