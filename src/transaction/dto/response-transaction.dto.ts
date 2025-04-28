import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';
import { ResponseGetCategoryDto } from 'src/category/dto/response-get-category.dto';

export class ResponseTransactionDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty({ type: ResponseGetCategoryDto })
  @ValidateNested()
  @Type(() => ResponseGetCategoryDto)
  category: ResponseGetCategoryDto;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty()
  @IsDate()
  date: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;
}
