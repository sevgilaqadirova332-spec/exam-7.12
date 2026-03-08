import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { VacanciesService } from './vacancies.service';
import { CreateVacancyDto, UpdateVacancyDto, VacancyFilterDto } from './dto/vacancy.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { JobType, ExperienceLevel } from './vacancy.entity';

@ApiTags('Vacancies')
@Controller('vacancies')
export class VacanciesController {
  constructor(private service: VacanciesService) {}

  // GET /vacancies?search=...&city=...&jobType=...
  @Get()
  @ApiOperation({
    summary: 'Vakansiyalar ro\'yxati (qidiruv va filter bilan)',
    description: 'Barcha aktiv vakansiyalar. Kalit so\'z, shahar, ish turi, tajriba bo\'yicha filtrlanadi.',
  })
  findAll(@Query() filter: VacancyFilterDto) {
    return this.service.findAll(filter);
  }

  // GET /vacancies/my — mening vakansiyalarim
  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Mening vakansiyalarim' })
  findMy(@CurrentUser() user: User) {
    return this.service.findByAuthor(user.id);
  }

  // GET /vacancies/:id
  @Get(':id')
  @ApiOperation({ summary: 'Vakansiya tafsilotlari (ko\'rilganlar soni oshadi)' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  // POST /vacancies
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Yangi vakansiya e\'lon qilish',
    description: 'Faqat "employer" rolida kirgan foydalanuvchi vakansiya e\'lon qila oladi.',
  })
  create(@Body() dto: CreateVacancyDto, @CurrentUser() user: User) {
    return this.service.create(dto, user.id);
  }

  // PATCH /vacancies/:id
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Vakansiyani tahrirlash (faqat egasi)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateVacancyDto,
    @CurrentUser() user: User,
  ) {
    return this.service.update(id, dto, user.id);
  }

  // DELETE /vacancies/:id
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Vakansiyani yopish (faqat egasi)' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.service.remove(id, user.id);
  }
}
