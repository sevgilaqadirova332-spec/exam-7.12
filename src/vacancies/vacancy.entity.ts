import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.entity';
import { Company } from '../companies/company.entity';
import { Category } from '../categories/category.entity';

// Ish turi
export enum JobType {
  FULL_TIME  = 'full_time',   // To'liq stavka
  PART_TIME  = 'part_time',   // Yarim stavka
  CONTRACT   = 'contract',    // Shartnoma asosida
  INTERNSHIP = 'internship',  // Amaliyot
  REMOTE     = 'remote',      // Masofaviy
}

// Tajriba darajasi
export enum ExperienceLevel {
  NO_EXPERIENCE = 'no_experience', // Tajribasiz
  JUNIOR        = 'junior',        // 1-2 yil
  MIDDLE        = 'middle',        // 2-5 yil
  SENIOR        = 'senior',        // 5+ yil
}

// Vakansiya holati
export enum VacancyStatus {
  ACTIVE   = 'active',   // Aktiv
  PAUSED   = 'paused',   // To'xtatilgan
  CLOSED   = 'closed',   // Yopilgan
}

@Entity('vacancies')
export class Vacancy {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'NestJS Backend Dasturchi' })
  @Column()
  title: string;

  @ApiProperty({ example: 'Biz tajribali backend dasturchi qidiryapmiz...' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ example: 'TypeScript, NestJS, PostgreSQL bilishi shart' })
  @Column({ type: 'text', nullable: true })
  requirements: string;

  @ApiProperty({ example: 'Korporativ transport, sog\'liq sug\'urtasi' })
  @Column({ type: 'text', nullable: true })
  benefits: string;

  @ApiProperty({ example: 3000000, description: 'So\'mda (minimal maosh)' })
  @Column({ nullable: true })
  salaryMin: number;

  @ApiProperty({ example: 7000000, description: 'So\'mda (maksimal maosh)' })
  @Column({ nullable: true })
  salaryMax: number;

  @ApiProperty({ example: false, description: 'true = maosh ko\'rsatilmaydi' })
  @Column({ default: false })
  salaryHidden: boolean;

  @ApiProperty({ example: 'Urganch' })
  @Column({ default: 'Urganch' })
  city: string;

  @ApiProperty({ enum: JobType })
  @Column({ type: 'enum', enum: JobType, default: JobType.FULL_TIME })
  jobType: JobType;

  @ApiProperty({ enum: ExperienceLevel })
  @Column({ type: 'enum', enum: ExperienceLevel, default: ExperienceLevel.NO_EXPERIENCE })
  experienceLevel: ExperienceLevel;

  @ApiProperty({ enum: VacancyStatus })
  @Column({ type: 'enum', enum: VacancyStatus, default: VacancyStatus.ACTIVE })
  status: VacancyStatus;

  @Column({ default: 0 })
  viewCount: number;        // Ko'rilganlar soni

  @Column({ default: 0 })
  applicationCount: number; // Ariza berilganlar soni

  // Munosabatlar
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  author: User;

  @Column()
  authorId: string;

  @ManyToOne(() => Company, { nullable: true })
  @JoinColumn()
  company: Company;

  @Column({ nullable: true })
  companyId: string;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn()
  category: Category;

  @Column({ nullable: true })
  categoryId: number;

  @Column({ nullable: true, type: 'timestamp' })
  expiresAt: Date; // Vakansiya muddati

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
