import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  // Yangi foydalanuvchi yaratish
  async create(data: Partial<User>): Promise<User> {

    if (!data.email) {
      throw new BadRequestException('Email required');
    }

    if (!data.password) {
      throw new BadRequestException('Password required');
    }

    const exists = await this.repo.findOne({
      where: { email: data.email },
    });

    if (exists) {
      throw new ConflictException("Bu email allaqachon ro'yxatdan o'tgan");
    }

    // parolni hash qilish
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = this.repo.create({
      ...data,
      password: hashedPassword,
    });

    return await this.repo.save(user);
  }

  // Email orqali topish (login uchun password bilan)
  async findByEmailWithPassword(email: string): Promise<User | null> {
    const user = await this.repo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    return user;
  }

  // ID bo‘yicha topish
  async findById(id: string): Promise<User> {
    const user = await this.repo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    return user;
  }

  // Barcha foydalanuvchilar
  async findAll(): Promise<User[]> {
    return await this.repo.find({
      order: { createdAt: 'DESC' },
    });
  }

  // Profil yangilash
  async update(id: string, data: Partial<User>): Promise<User> {

    const user = await this.findById(id);

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    Object.assign(user, data);

    return await this.repo.save(user);
  }
}