// ===== categories.service.ts =====
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private repo: Repository<Category>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  async findById(id: number): Promise<Category> {
    const cat = await this.repo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException('Kategoriya topilmadi');
    return cat;
  }

  create(data: Partial<Category>): Promise<Category> {
    const cat = this.repo.create(data);
    return this.repo.save(cat);
  }
}
