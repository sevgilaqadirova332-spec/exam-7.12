import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('categories')
export class Category {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'IT va Dasturlash' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ example: 'it-dasturlash' })
  @Column({ unique: true })
  slug: string;

  @ApiProperty({ example: '💻' })
  @Column({ nullable: true })
  icon: string;

  @ApiProperty({ example: 'Dasturchi, dizayner, tester...' })
  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  vacancyCount: number;

  @CreateDateColumn()
  createdAt: Date;
}
