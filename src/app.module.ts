import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VacanciesModule } from './vacancies/vacancies.module';
import { CompaniesModule } from './companies/companies.module';
import { ResumesModule } from './resumes/resumes.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    // .env faylni o'qish (isGlobal: true = hamma joyda ishlaydi)
    ConfigModule.forRoot({ isGlobal: true }),

    // PostgreSQL ulanish sozlamalari
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USER', 'postgres'),
        password: config.get('DB_PASS', 'postgres'),
        database: config.get('DB_NAME', 'xorazm_jobs'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,  // DEV da: jadvallarni avtomatik yaratadi
        logging: false,     // SQL so'rovlarini consoleda ko'rsatish
      }),
      inject: [ConfigService],
    }),

    // Barcha modullar
    AuthModule,
    UsersModule,
    VacanciesModule,
    CompaniesModule,
    ResumesModule,
    CategoriesModule,
  ],
})
export class AppModule {}
