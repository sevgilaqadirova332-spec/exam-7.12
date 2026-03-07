import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  Matches,
} from 'class-validator';
import { UserRole } from '../../users/user.entity';

// === RO'YXATDAN O'TISH ===
export class RegisterDto {
  @ApiProperty({ example: 'sevgilaqadirova@gmail.com', description: 'Email manzil' })
  @IsEmail({}, { message: 'Email noto\'g\'ri formatda' })
  email: string;

  @ApiProperty({ example: 'sevgilaqadirova', description: 'Ism' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'sevgilaqadirova', description: 'Familiya' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '+998953484246', required: false })
  @IsOptional()
  @Matches(/^\+998[0-9]{9}$/, { message: 'O\'zbek telefon raqami kiriting: +998XXXXXXXXX' })
  phone?: string;

  @ApiProperty({
    example: 'jobseeker',
    enum: UserRole,
    description: 'Rol: jobseeker (ish izlovchi) yoki employer (ish beruvchi)',
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ example: 'Parol123!', description: 'Kamida 6 ta belgi' })
  @IsString()
  @MinLength(6, { message: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' })
  password: string;
}

// === KIRISH ===
export class LoginDto {
  @ApiProperty({ example: 'sevgilaqadirova@gmail.com' })
  @IsEmail({}, { message: 'Email noto\'g\'ri' })
  email: string;

  @ApiProperty({ example: 'Parol123!' })
  @IsString()
  password: string;
}

// === JAVOB (Response) ===
export class AuthResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({
    description: 'Foydalanuvchi ma\'lumotlari',
    example: {
      id: 'uuid-...',
      email: 'sevgilaqadirova@gmail.com',
      firstName: 'sevgi',
      role: 'jobseeker',
    },
  })
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}
