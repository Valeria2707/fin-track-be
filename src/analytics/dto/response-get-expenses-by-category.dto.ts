import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ResponseGetExpensesByCategoryDto {
  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsNumber()
  total: number;
}
