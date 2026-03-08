import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNumber, IsUrl, Min, Max } from 'class-validator';
import { CompanySize } from '../company.entity';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Xorazm Texnologiyalari MChJ' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'IT sohasida xizmat ko\'rsatuvchi kompaniya', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Urganch sh., Amir Temur ko\'chasi 12', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Urganch', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'https://xorazm-tech.uz', required: false })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ example: '+998953484246', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'IT va Dasturlash', required: false })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiProperty({ enum: CompanySize, example: CompanySize.SMALL, required: false })
  @IsOptional()
  @IsEnum(CompanySize)
  size?: CompanySize;

  @ApiProperty({ example: 2015, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear())
  foundedYear?: number;
}

export class UpdateCompanyDto extends CreateCompanyDto {}
