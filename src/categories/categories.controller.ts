import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateCategoryDto {
  @ApiProperty({ example: 'IT va Dasturlash' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'it-dasturlash' })
  @IsString()
  slug: string;

  @ApiProperty({ example: '💻', required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private service: CategoriesService) {}

  // GET /categories — barcha kategoriyalar
  @Get()
  @ApiOperation({ summary: 'Barcha ish kategoriyalari' })
  findAll() {
    return this.service.findAll();
  }

  // GET /categories/:id
  @Get(':id')
  @ApiOperation({ summary: 'Kategoriyani ko\'rish' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  // POST /categories
  @Post()
  @ApiOperation({ summary: 'Yangi kategoriya qo\'shish (admin)' })
  create(@Body() dto: CreateCategoryDto) {
    return this.service.create(dto);
  }
}
