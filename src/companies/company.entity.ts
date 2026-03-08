import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.entity';

// Kompaniya hajmi
export enum CompanySize {
  SMALL   = 'small',  
  MEDIUM  = 'medium',  
  LARGE   = 'large',    
}

@Entity('companies')
export class Company {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Xorazm Texnologiyalari MChJ' })
  @Column()
  name: string;

  @ApiProperty({ example: 'IT sohasida xizmat ko\'rsatuvchi kompaniya' })
  @Column({ nullable: true, type: 'text' })
  description: string;

  @ApiProperty({ example: 'Urganch sh., Amir Temur ko\'chasi 12' })
  @Column({ nullable: true })
  address: string;

  @ApiProperty({ example: 'Urganch' })
  @Column({ default: 'Urganch' })
  city: string;

  @ApiProperty({ example: 'https://xorazm-tech.uz' })
  @Column({ nullable: true })
  website: string;

  @ApiProperty({ example: '+998953484246' })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({ example: 'IT va Dasturlash' })
  @Column({ nullable: true })
  industry: string;

  @ApiProperty({ enum: CompanySize })
  @Column({ type: 'enum', enum: CompanySize, default: CompanySize.SMALL })
  size: CompanySize;

  @ApiProperty({ example: 2015 })
  @Column({ nullable: true })
  foundedYear: number;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ default: true })
  isActive: boolean;

  // Kompaniya egasi (employer)
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
