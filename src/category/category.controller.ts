import { Controller, Get, Param, NotFoundException, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseGetCategoryDto } from './dto/response-get-category.dto';
import { AccessTokenGuard } from 'src/guards/access-token.guard';

@UseGuards(AccessTokenGuard)
@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Get all categories.' })
  @ApiCreatedResponse({ description: 'Created Successfully', type: ResponseGetCategoryDto, isArray: true })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get()
  async findAll() {
    return await this.categoryService.findAll();
  }

  @ApiOperation({ summary: 'Get category by id.' })
  @ApiCreatedResponse({ description: 'Created Successfully', type: ResponseGetCategoryDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const category = await this.categoryService.findOne(+id);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }
}
