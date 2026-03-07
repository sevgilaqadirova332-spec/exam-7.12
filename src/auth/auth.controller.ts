import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto/auth.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@ApiTags('Auth — Autentifikatsiya') // Swagger da guruh nomi
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ========================
  // POST /auth/register
  // ========================
  @Post('register')
  @ApiOperation({
    summary: 'Ro\'yxatdan o\'tish',
    description: 'Yangi foydalanuvchi yaratadi va JWT token qaytaradi',
  })
  @ApiResponse({
    status: 201,
    description: 'Muvaffaqiyatli ro\'yxatdan o\'tildi',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Bu email allaqachon mavjud' })
  @ApiResponse({ status: 400, description: 'Ma\'lumotlar noto\'g\'ri' })
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(dto);
  }

  // ========================
  // POST /auth/login
  // ========================
  @Post('login')
  @HttpCode(HttpStatus.OK) // Default 201 emas, 200 qaytarsin
  @ApiOperation({
    summary: 'Tizimga kirish',
    description: 'Email va parol bilan kirish, JWT token olish',
  })
  @ApiResponse({
    status: 200,
    description: 'Muvaffaqiyatli kirildi',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Email yoki parol noto\'g\'ri' })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  // ========================
  // GET /auth/me  (himoyalangan)
  // ========================
  @Get('me')
  @UseGuards(JwtAuthGuard)        // JWT token talab qilinadi
  @ApiBearerAuth()                 // Swagger da "Authorize" tugmasi
  @ApiOperation({
    summary: 'Mening profilim',
    description: 'Token orqali joriy foydalanuvchi ma\'lumotlarini olish',
  })
  @ApiResponse({ status: 200, description: 'Profil ma\'lumotlari' })
  @ApiResponse({ status: 401, description: 'Token yo\'q yoki yaroqsiz' })
  async getMe(@CurrentUser() user: User) {
    return this.authService.getMe(user.id);
  }
}
