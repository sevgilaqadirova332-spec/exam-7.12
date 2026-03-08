import {
  Injectable, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private repo: Repository<Company>,
  ) {}

  // Barcha kompaniyalar
  findAll(): Promise<Company[]> {
    return this.repo.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
      relations: ['owner'],
    });
  }

  // Bitta kompaniya
  async findById(id: string): Promise<Company> {
    const company = await this.repo.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!company) throw new NotFoundException('Kompaniya topilmadi');
    return company;
  }

  // Yaratish (faqat employer)
  create(dto: CreateCompanyDto, ownerId: string): Promise<Company> {
    const company = this.repo.create({ ...dto, ownerId });
    return this.repo.save(company);
  }

  // Yangilash (faqat egasi)
  async update(id: string, dto: UpdateCompanyDto, userId: string): Promise<Company> {
    const company = await this.findById(id);
    if (company.ownerId !== userId) {
      throw new ForbiddenException('Siz bu kompaniyani tahrirlay olmaysiz');
    }
    await this.repo.update(id, dto);
    return this.findById(id);
  }

  // O'chirish (faqat egasi)
  async remove(id: string, userId: string): Promise<{ message: string }> {
    const company = await this.findById(id);
    if (company.ownerId !== userId) {
      throw new ForbiddenException('Siz bu kompaniyani o\'chira olmaysiz');
    }
    await this.repo.update(id, { isActive: false }); // Soft delete
    return { message: 'Kompaniya o\'chirildi' };
  }
}
