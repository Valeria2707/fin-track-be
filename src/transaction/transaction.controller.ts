import { Controller, Get, Post, Body, Param, Delete, Query, Put, NotFoundException } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTransactionDto, ResponseRemoveTransactionDto, ResponseTransactionDto, UpdateTransactionDto } from './dto';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiOperation({ summary: 'Create transaction.' })
  @ApiCreatedResponse({
    description: 'Created Successfully',
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
    description: 'Created Successfully',
    type: ResponseTransactionDto,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get()
  findAll(@Query() query: { [key: string]: string | undefined }) {
    const { type, category_id, fromDate, toDate, page = '1', limit = '10' } = query;

    return this.transactionService.findAll(
      type,
      category_id ? Number(category_id) : undefined,
      fromDate ? new Date(fromDate) : undefined,
      toDate ? new Date(toDate) : undefined,
      Number(page),
      Number(limit),
    );
  }

  @ApiOperation({ summary: 'Get transaction by id.' })
  @ApiCreatedResponse({
    description: 'Created Successfully',
    type: ResponseTransactionDto,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    const transaction = this.transactionService.findOne(+id);

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  @ApiOperation({ summary: 'Update transaction.' })
  @ApiCreatedResponse({
    description: 'Updated Successfully',
    type: ResponseTransactionDto,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    const updatedTransaction = this.transactionService.update(+id, updateTransactionDto);

    if (!updatedTransaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return updatedTransaction;
  }

  @ApiOperation({ summary: 'Remove transaction.' })
  @ApiCreatedResponse({
    description: 'Deleted Successfully',
    type: ResponseRemoveTransactionDto,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    const deleted = this.transactionService.remove(+id);

    if (!deleted) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return { message: `Transaction with ID ${id} deleted successfully` };
  }
}
