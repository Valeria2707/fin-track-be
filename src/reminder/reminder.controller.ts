import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateReminderDto,
  ResponseReminder,
  ResponseRemoveRenimder,
} from './dto';

@ApiTags('Reminder')
@Controller('reminder')
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @ApiOperation({ summary: 'Create reminder.' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseReminder,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post()
  create(@Body() createReminderDto: CreateReminderDto) {
    return this.reminderService.create(createReminderDto);
  }

  @ApiOperation({ summary: 'Get all reminders.' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseReminder,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get()
  findAll() {
    return this.reminderService.findAll();
  }

  @ApiOperation({ summary: 'Get reminder by id.' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseReminder,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reminderService.findOne(+id);
  }

  @ApiOperation({ summary: 'Remove reminder.' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseRemoveRenimder,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reminderService.remove(+id);
  }
}
