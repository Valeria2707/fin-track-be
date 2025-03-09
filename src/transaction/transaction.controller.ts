import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateTransactionDto,
  ResponseRemoveTransactionDto,
  ResponseTransactionDto,
  UpdateTransactionDto,
} from './dto';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiOperation({ summary: 'Create transaction.' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseTransactionDto,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @ApiOperation({ summary: 'Get all transactions.' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseTransactionDto,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get()
  findAll(@Query() query: { [key: string]: string | undefined }) {
    const { type, category_id, fromDate, toDate } = query;

    return this.transactionService.findAll(
      type,
      category_id ? Number(category_id) : undefined,
      fromDate ? new Date(fromDate) : undefined,
      toDate ? new Date(toDate) : undefined,
    );
  }

  @ApiOperation({ summary: 'Get transaction by id.' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseTransactionDto,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update transaction.' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseTransactionDto,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(+id, updateTransactionDto);
  }

  @ApiOperation({ summary: 'Remove transaction.' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseRemoveTransactionDto,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}
