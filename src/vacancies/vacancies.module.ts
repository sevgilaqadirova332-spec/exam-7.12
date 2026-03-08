import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacancy } from './vacancy.entity';
import { VacanciesService } from './vacancies.service';
import { VacanciesController } from './vacancies.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vacancy])],
  providers: [VacanciesService],
  controllers: [VacanciesController],
  exports: [VacanciesService],
})
export class VacanciesModule {}
