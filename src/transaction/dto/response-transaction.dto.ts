import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ResponseGetCategoryDto } from 'src/category/dto/response-get-category.dto';

export class ResponseTransactionDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNumber()
  user_id: number;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty({ type: ResponseGetCategoryDto })
  @ValidateNested()
  @Type(() => ResponseGetCategoryDto)
  category: ResponseGetCategoryDto;

  @ApiProperty()
  @IsString()
  amount: string;

  @ApiProperty()
  @IsDate()
  date: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;
}
