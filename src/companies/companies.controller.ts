import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(private service: CompaniesService) {}

  // GET /companies
  @Get()
  @ApiOperation({ summary: 'Barcha kompaniyalar ro\'yxati' })
  findAll() {
    return this.service.findAll();
  }

  // GET /companies/:id
  @Get(':id')
  @ApiOperation({ summary: 'Kompaniya ma\'lumotlari' })
  @ApiResponse({ status: 404, description: 'Topilmadi' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  // POST /companies
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Kompaniya yaratish',
    description: 'Faqat "employer" rolida bo\'lgan foydalanuvchi kompaniya yarata oladi.',
  })
  create(@Body() dto: CreateCompanyDto, @CurrentUser() user: User) {
    return this.service.create(dto, user.id);
  }

  // PATCH /companies/:id
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Kompaniyani yangilash (faqat egasi)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDto,
    @CurrentUser() user: User,
  ) {
    return this.service.update(id, dto, user.id);
  }

  // DELETE /companies/:id
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Kompaniyani o\'chirish (faqat egasi)' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.service.remove(id, user.id);
  }
}
