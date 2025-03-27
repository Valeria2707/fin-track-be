import { Controller, Get, Post, Body, Param, Delete, Query, Put, NotFoundException, UseGuards, Req } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTransactionDto, ResponseRemoveTransactionDto, ResponseTransactionDto, UpdateTransactionDto } from './dto';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { Request } from 'express';

@UseGuards(AccessTokenGuard)
@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiOperation({ summary: 'Create transaction.' })
  @ApiCreatedResponse({ description: 'Created Successfully', type: ResponseTransactionDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto, @Req() req: Request) {
    const userId = req.user['sub'];
    return await this.transactionService.create(createTransactionDto, userId);
  }

  @ApiOperation({ summary: 'Get all transactions.' })
  @ApiCreatedResponse({ description: 'Created Successfully', type: ResponseTransactionDto, isArray: true })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get()
  async findAll(@Query() query: { [key: string]: string | undefined }, @Req() req: Request) {
    const { type, category_id, fromDate, toDate, page = '1', limit = '10' } = query;
    const userId = req.user['sub'];

    return await this.transactionService.findAll(
      userId,
      type,
      category_id ? Number(category_id) : undefined,
      fromDate ? new Date(fromDate) : undefined,
      toDate ? new Date(toDate) : undefined,
      Number(page),
      Number(limit),
    );
  }

  @ApiOperation({ summary: 'Get transaction by id.' })
  @ApiCreatedResponse({ description: 'Created Successfully', type: ResponseTransactionDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const transaction = await this.transactionService.findOne(+id);

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  @ApiOperation({ summary: 'Update transaction.' })
  @ApiCreatedResponse({ description: 'Updated Successfully', type: ResponseTransactionDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    const updatedTransaction = await this.transactionService.update(+id, updateTransactionDto);

    if (!updatedTransaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return updatedTransaction;
  }

  @ApiOperation({ summary: 'Remove transaction.' })
  @ApiCreatedResponse({ description: 'Deleted Successfully', type: ResponseRemoveTransactionDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.transactionService.remove(+id);

    if (!deleted) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return { message: `Transaction with ID ${id} deleted successfully` };
  }
}
