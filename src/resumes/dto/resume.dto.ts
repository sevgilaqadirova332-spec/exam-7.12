import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNumber, Min } from 'class-validator';
import { ResumeStatus } from '../resume.entity';

export class CreateResumeDto {
  @ApiProperty({ example: 'Backend Dasturchi' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'NestJS va TypeScript bilan 2 yil ishlagan', required: false })
  @IsOptional() @IsString()
  about?: string;

  @ApiProperty({ example: 'Urganch', required: false })
  @IsOptional() @IsString()
  city?: string;

  @ApiProperty({ example: 3000000, required: false })
  @IsOptional() @IsNumber() @Min(0)
  expectedSalary?: number;

  @ApiProperty({ example: '2 yil', required: false })
  @IsOptional() @IsString()
  experience?: string;

  @ApiProperty({ example: 'Oliy — Urganch DU', required: false })
  @IsOptional() @IsString()
  education?: string;

  @ApiProperty({ example: 'TypeScript, NestJS, React', required: false })
  @IsOptional() @IsString()
  skills?: string;

  @ApiProperty({ example: '+998612345678', required: false })
  @IsOptional() @IsString()
  phone?: string;
}

export class UpdateResumeDto extends CreateResumeDto {
  @ApiProperty({ enum: ResumeStatus, required: false })
  @IsOptional() @IsEnum(ResumeStatus)
  status?: ResumeStatus;
}
