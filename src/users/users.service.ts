import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>, // TypeORM repository
  ) {}

  // Yangi foydalanuvchi yaratish
  async create(data: Partial<User>): Promise<User> {
    // Email allaqachon bormi?
    const exists = await this.usersRepository.findOne({
      where: { email: data.email },
    });
    if (exists) {
      throw new ConflictException('Bu email allaqachon ro\'yxatdan o\'tgan');
    }

    // Parolni hash qilish (bcrypt)
    const hashedPassword = await bcrypt.hash(data.password as string, 10);

    const user = this.usersRepository.create({
      ...data,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  // Email bo'yicha topish
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  // ID bo'yicha topish
  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
    return user;
  }
}
