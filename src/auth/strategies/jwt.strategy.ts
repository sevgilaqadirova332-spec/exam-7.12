import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      // Token "Authorization: Bearer <token>" headerdan olinadi
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET', 'default_secret'),
    });
  }

  // Token valid bo'lsa bu method chaqiriladi, qaytgan qiymat req.user ga tushadi
  async validate(payload: { sub: string; email: string; role: string }) {
    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Token yaroqsiz yoki foydalanuvchi bloklangan');
    }
    return user;
  }
}
