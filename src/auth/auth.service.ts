import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Ro'yxatdan o'tish
  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    // Yangi user yaratish (usersService ichida hash bo'ladi)
    const user = await this.usersService.create(dto);

    // JWT token yaratish
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  // Kirish
  async login(dto: LoginDto): Promise<AuthResponseDto> {
    // 1. Email bo'yicha userni topish
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Email yoki parol noto\'g\'ri');
    }

    // 2. Parolni tekshirish
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email yoki parol noto\'g\'ri');
    }

    // 3. Faolmi?
    if (!user.isActive) {
      throw new UnauthorizedException('Hisobingiz bloklangan');
    }

    // 4. Token yaratish
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  // Mening profilim (token orqali)
  async getMe(userId: string) {
    const user = await this.usersService.findById(userId);
    // Parolni javobda qaytarmaymiz!
    const { password, ...result } = user;
    return result;
  }

  // Token yaratish — private helper
  private generateToken(userId: string, email: string, role: string): string {
    // Bu ma'lumotlar token ichiga saqlanadi (payload)
    const payload = { sub: userId, email, role };
    return this.jwtService.sign(payload);
  }
}
