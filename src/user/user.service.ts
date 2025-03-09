import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './interfaces/user.interface';
import { UpdatePartialUserDto } from './dto/update-partial-user.dto';
import { Client } from 'pg';

@Injectable()
export class UserService {
  constructor(@Inject('PG_CLIENT') private readonly client: Client) {}
  async findOne(id: string): Promise<IUser> {
    const result = await this.client.query(
      'SELECT * FROM users WHERE id = $1',
      [id],
    );
    if (!result.rows.length) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    console.log(result.rows[0]);
    return result.rows[0];
  }

  async findOneByEmail(email: string): Promise<IUser> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await this.client.query(query, [email]);

    return result.rows[0];
  }

  async findOneAndUpdate(
    id: string,
    updateBody: UpdatePartialUserDto,
  ): Promise<IUser> {
    const query = `
      UPDATE users
      SET email = COALESCE($2, email),
          name = COALESCE($3, name),
          password = COALESCE($4, password),
          accesstoken = COALESCE($5, accesstoken),
          refreshtoken = COALESCE($6, refreshtoken)
      WHERE id = $1
      RETURNING *`;
    const values = [
      id,
      updateBody.email,
      updateBody.name,
      updateBody.password,
      updateBody.accessToken,
      updateBody.refreshtoken,
    ];

    const result = await this.client.query(query, values);

    if (result.rows.length === 0) {
      throw new NotFoundException(`Failed to update user with ID ${id}`);
    }

    return result.rows[0];
  }

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const query = `
    INSERT INTO users (email, name, password, accesstoken, refreshtoken)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`;
    const values = [
      createUserDto.email,
      createUserDto.name,
      createUserDto.password,
      createUserDto.accessToken,
      createUserDto.refreshtoken,
    ];

    const result = await this.client.query(query, values);

    if (result.rows.length === 0) {
      throw new Error('Failed to create user');
    }

    return result.rows[0];
  }
}
