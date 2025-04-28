import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ResponseGetQueriesDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  query: string;

  @ApiProperty()
  @IsString()
  response: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  date: Date;
}
