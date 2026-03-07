import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // User entity ni ro'yxatga olish
  providers: [UsersService],
  exports: [UsersService], // AuthModule ishlatishi uchun export
})
export class UsersModule {}
