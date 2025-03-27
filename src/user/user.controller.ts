import { Body, Controller, Get, Param, Post, NotFoundException, BadRequestException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, ResponseCreateUserDto, ResponseGetUserDto } from './dto';
import { AccessTokenGuard } from 'src/guards/access-token.guard';

@UseGuards(AccessTokenGuard)
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get user by id.' })
  @ApiCreatedResponse({
    description: 'Created Successfully',
    type: ResponseGetUserDto,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @ApiOperation({ summary: 'Create user.' })
  @ApiCreatedResponse({
    description: 'Created Successfully',
    type: ResponseCreateUserDto,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.create(createUserDto);
    } catch {
      throw new BadRequestException('Failed to create user');
    }
  }
}
