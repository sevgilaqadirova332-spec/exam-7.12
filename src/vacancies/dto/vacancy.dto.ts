import { ApiProperty } from '@nestjs/swagger';
import {
  IsString, IsOptional, IsEnum, IsNumber,
  IsBoolean, IsDate, Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { JobType, ExperienceLevel, VacancyStatus } from '../vacancy.entity';

// Vakansiya yaratish
export class CreateVacancyDto {
  @ApiProperty({ example: 'NestJS Backend Dasturchi' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Biz tajribali backend dasturchi qidiryapmiz...' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'TypeScript, NestJS, PostgreSQL', required: false })
  @IsOptional()
  @IsString()
  requirements?: string;

  @ApiProperty({ example: 'Korporativ transport, sog\'liq sug\'urtasi', required: false })
  @IsOptional()
  @IsString()
  benefits?: string;

  @ApiProperty({ example: 3000000, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMin?: number;

  @ApiProperty({ example: 7000000, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMax?: number;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  salaryHidden?: boolean;

  @ApiProperty({ example: 'Urganch', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ enum: JobType, example: JobType.FULL_TIME, required: false })
  @IsOptional()
  @IsEnum(JobType)
  jobType?: JobType;

  @ApiProperty({ enum: ExperienceLevel, example: ExperienceLevel.JUNIOR, required: false })
  @IsOptional()
  @IsEnum(ExperienceLevel)
  experienceLevel?: ExperienceLevel;

  @ApiProperty({ example: 'uuid-company-id', required: false })
  @IsOptional()
  @IsString()
  companyId?: string;

  @ApiProperty({ example: 1, description: 'Kategoriya ID', required: false })
  @IsOptional()
  @IsNumber()
  categoryId?: number;
}

// Vakansiya yangilash (barcha maydonlar ixtiyoriy)
export class UpdateVacancyDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() title?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() requirements?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() benefits?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() salaryMin?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() salaryMax?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() salaryHidden?: boolean;
  @ApiProperty({ required: false }) @IsOptional() @IsString() city?: string;
  @ApiProperty({ enum: JobType, required: false }) @IsOptional() @IsEnum(JobType) jobType?: JobType;
  @ApiProperty({ enum: ExperienceLevel, required: false }) @IsOptional() @IsEnum(ExperienceLevel) experienceLevel?: ExperienceLevel;
  @ApiProperty({ enum: VacancyStatus, required: false }) @IsOptional() @IsEnum(VacancyStatus) status?: VacancyStatus;
}

// Qidirish filtrlari
export class VacancyFilterDto {
  @ApiProperty({ required: false, description: 'Kalit so\'z bilan qidirish' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, example: 'Urganch' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ enum: JobType, required: false })
  @IsOptional()
  @IsEnum(JobType)
  jobType?: JobType;

  @ApiProperty({ enum: ExperienceLevel, required: false })
  @IsOptional()
  @IsEnum(ExperienceLevel)
  experienceLevel?: ExperienceLevel;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  categoryId?: number;

  @ApiProperty({ required: false, example: 1000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  salaryFrom?: number;
}
