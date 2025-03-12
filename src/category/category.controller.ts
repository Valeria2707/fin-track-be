import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseGetCategoryDto } from './dto/response-get-category.dto';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Get categories.' })
  @ApiCreatedResponse({
    description: 'Created Successfully',
    type: ResponseGetCategoryDto,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @ApiOperation({ summary: 'Get category by id.' })
  @ApiCreatedResponse({
    description: 'Created Successfully',
    type: ResponseGetCategoryDto,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    const category = this.categoryService.findOne(+id);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }
}
