import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail, IsString, MinLength, IsEnum,
  IsOptional, Matches,
} from 'class-validator';
import { UserRole } from '../../users/user.entity';

// ===========================
// Ro'yxatdan o'tish
// ===========================
export class RegisterDto {
  @ApiProperty({ example: 'sevgilaqadirova@gmail.com' })
  @IsEmail({}, { message: 'To\'g\'ri email kiriting' })
  email: string;

  @ApiProperty({ example: 'sevgi' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'qadirova' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '+998953484246', required: false, description: 'Xorazm: +99861, +99862' })
  @IsOptional()
  @Matches(/^\+998[0-9]{9}$/, { message: 'Format: +998XXXXXXXXX' })
  phone?: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.JOBSEEKER,
    description: 'jobseeker = ish izlovchi | employer = ish beruvchi',
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ example: 'Parol@123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Parol kamida 6 ta belgi bo\'lishi kerak' })
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'sevgilaqadirova@gmail.com' })
  @IsEmail({}, { message: 'To\'g\'ri email kiriting' })
  email: string;

  @ApiProperty({ example: 'Parol@123' })
  @IsString()
  password: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'EskiParol@123' })
  @IsString()
  oldPassword: string;

  @ApiProperty({ example: 'YangiParol@456', minLength: 6 })
  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT access token — har so\'rovda Authorization headerga qo\'shing' })
  accessToken: string;

  @ApiProperty()
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    city: string;
  };
}
