import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import {
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
  AuthResponseDto,
} from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Ro'yxatdan o'tish
  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const user = await this.usersService.create(dto);

    const token = this.makeToken(user.id, user.email, user.role);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        city: user.city,
      },
    };
  }

  // Login
  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmailWithPassword(dto.email);

    if (!user) {
      throw new UnauthorizedException("Email yoki parol noto'g'ri");
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException("Email yoki parol noto'g'ri");
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        "Hisobingiz bloklangan. Admin bilan bog'laning.",
      );
    }

    const token = this.makeToken(user.id, user.email, user.role);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        city: user.city,
      },
    };
  }

  // Profil (me)
  async getMe(userId: string) {
    const user = await this.usersService.findById(userId);

    const { password, ...safeUser } = user as any;

    return safeUser;
  }

  // Parolni o'zgartirish
  async changePassword(userId: string, dto: ChangePasswordDto) {

    const user = await this.usersService.findById(userId);

    const fullUser = await this.usersService.findByEmailWithPassword(user.email);

    if (!fullUser) {
      throw new UnauthorizedException("User topilmadi");
    }

    const isMatch = await bcrypt.compare(dto.oldPassword, fullUser.password);

    if (!isMatch) {
      throw new UnauthorizedException("Eski parol noto'g'ri");
    }

    const newHash = await bcrypt.hash(dto.newPassword, 10);

    await this.usersService.update(userId, {
      password: newHash,
    } as any);

    return { message: "Parol muvaffaqiyatli o'zgartirildi" };
  }

  // JWT token yaratish
  private makeToken(userId: string, email: string, role: string): string {
    return this.jwtService.sign({
      sub: userId,
      email,
      role,
    });
  }
}