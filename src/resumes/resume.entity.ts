import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.entity';

// Rezyume holati
export enum ResumeStatus {
  ACTIVE  = 'active',  // Ochiq — ish beruvchilar ko'ra oladi
  HIDDEN  = 'hidden',  // Yashirin
}

@Entity('resumes')
export class Resume {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Backend Dasturchi' })
  @Column()
  title: string; // Kasb nomi

  @ApiProperty({ example: 'NestJS, TypeScript, PostgreSQL bilan 2 yil tajribam bor...' })
  @Column({ type: 'text', nullable: true })
  about: string;

  @ApiProperty({ example: 'Urganch' })
  @Column({ default: 'Urganch' })
  city: string;

  @ApiProperty({ example: 3000000, description: 'Kutilayotgan maosh (so\'m)' })
  @Column({ nullable: true })
  expectedSalary: number;

  @ApiProperty({ example: '2 yil' })
  @Column({ nullable: true })
  experience: string;

  @ApiProperty({ example: 'Oliy ma\'lumot — Urganch Davlat Universiteti' })
  @Column({ nullable: true })
  education: string;

  @ApiProperty({ example: 'TypeScript, NestJS, React, SQL' })
  @Column({ nullable: true })
  skills: string;

  @ApiProperty({ example: '+998953484246' })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({ enum: ResumeStatus })
  @Column({ type: 'enum', enum: ResumeStatus, default: ResumeStatus.ACTIVE })
  status: ResumeStatus;

  // Egasi
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  owner: User;

  @Column()
  ownerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
