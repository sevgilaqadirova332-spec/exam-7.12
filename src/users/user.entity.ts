import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// Foydalanuvchi rollari
export enum UserRole {
  JOBSEEKER = 'jobseeker',  // Ish izlovchi
  EMPLOYER  = 'employer',   // Ish beruvchi (kompaniya)
  ADMIN     = 'admin',      // Administrator
}

@Entity('users')
export class User {
  @ApiProperty({ example: 'uuid-123' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'sevgilaqadirova@gmail.com' })
  @Column({ unique: true })
  email: string;

  // Parol HECH QACHON response da qaytarilmaydi
  @Column({ select: false })
  password: string;

  @ApiProperty({ example: 'sevgi' })
  @Column()
  firstName: string;

  @ApiProperty({ example: 'qadirova' })
  @Column()
  lastName: string;

  @ApiProperty({ example: '+998953484246' })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({ example: 'Urganch' })
  @Column({ nullable: true, default: 'Xorazm viloyati' })
  city: string;

  @ApiProperty({ enum: UserRole })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.JOBSEEKER })
  role: UserRole;

  @ApiProperty()
  @Column({ default: false })
  isEmailVerified: boolean;

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  avatarUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
