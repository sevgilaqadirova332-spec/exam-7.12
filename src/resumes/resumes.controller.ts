import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ResumesService } from './resumes.service';
import { CreateResumeDto, UpdateResumeDto } from './dto/resume.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@ApiTags('Resumes')
@Controller('resumes')
export class ResumesController {
  constructor(private service: ResumesService) {}

  @Get()
  @ApiOperation({ summary: 'Barcha ochiq rezyumeler (ish beruvchilar uchun)' })
  findAll() { return this.service.findAll(); }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Mening rezyumelerim' })
  findMy(@CurrentUser() user: User) { return this.service.findByOwner(user.id); }

  @Get(':id')
  @ApiOperation({ summary: 'Rezyumeni ko\'rish' })
  findOne(@Param('id') id: string) { return this.service.findById(id); }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Rezyume yaratish' })
  create(@Body() dto: CreateResumeDto, @CurrentUser() user: User) {
    return this.service.create(dto, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Rezyumeni yangilash (faqat egasi)' })
  update(@Param('id') id: string, @Body() dto: UpdateResumeDto, @CurrentUser() user: User) {
    return this.service.update(id, dto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Rezyumeni o\'chirish (faqat egasi)' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.service.remove(id, user.id);
  }
}
