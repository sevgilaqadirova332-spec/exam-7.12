import {
  Injectable, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vacancy, VacancyStatus } from './vacancy.entity';
import { CreateVacancyDto, UpdateVacancyDto, VacancyFilterDto } from './dto/vacancy.dto';

@Injectable()
export class VacanciesService {
  constructor(
    @InjectRepository(Vacancy)
    private repo: Repository<Vacancy>,
  ) {}

  // Barcha vakansiyalar (filtrlash bilan)
  async findAll(filter: VacancyFilterDto): Promise<Vacancy[]> {
    const qb = this.repo
      .createQueryBuilder('v')
      .leftJoinAndSelect('v.company', 'company')
      .leftJoinAndSelect('v.category', 'category')
      .leftJoinAndSelect('v.author', 'author')
      .where('v.status = :status', { status: VacancyStatus.ACTIVE });

    // Qidirish
    if (filter.search) {
      qb.andWhere('(v.title ILIKE :s OR v.description ILIKE :s)', {
        s: `%${filter.search}%`,
      });
    }

    // Shahar bo'yicha
    if (filter.city) {
      qb.andWhere('v.city = :city', { city: filter.city });
    }

    // Ish turi bo'yicha
    if (filter.jobType) {
      qb.andWhere('v.jobType = :jobType', { jobType: filter.jobType });
    }

    // Tajriba bo'yicha
    if (filter.experienceLevel) {
      qb.andWhere('v.experienceLevel = :exp', { exp: filter.experienceLevel });
    }

    // Kategoriya bo'yicha
    if (filter.categoryId) {
      qb.andWhere('v.categoryId = :catId', { catId: filter.categoryId });
    }

    // Minimal maosh bo'yicha
    if (filter.salaryFrom) {
      qb.andWhere('v.salaryMin >= :sal', { sal: filter.salaryFrom });
    }

    return qb.orderBy('v.createdAt', 'DESC').getMany();
  }

  // Bitta vakansiya (ko'rilganlar sonini oshiradi)
  async findById(id: string): Promise<Vacancy> {
    const vacancy = await this.repo.findOne({
      where: { id },
      relations: ['company', 'category', 'author'],
    });
    if (!vacancy) throw new NotFoundException('Vakansiya topilmadi');

    // Ko'rilganlar soni +1
    await this.repo.increment({ id }, 'viewCount', 1);
    vacancy.viewCount += 1;

    return vacancy;
  }

  // Mening vakansiyalarim
  findByAuthor(authorId: string): Promise<Vacancy[]> {
    return this.repo.find({
      where: { authorId },
      relations: ['company', 'category'],
      order: { createdAt: 'DESC' },
    });
  }

  // Yaratish
  create(dto: CreateVacancyDto, authorId: string): Promise<Vacancy> {
    const vacancy = this.repo.create({ ...dto, authorId });
    return this.repo.save(vacancy);
  }

  // Yangilash
  async update(id: string, dto: UpdateVacancyDto, userId: string): Promise<Vacancy> {
    const vacancy = await this.repo.findOne({ where: { id } });
    if (!vacancy) throw new NotFoundException('Vakansiya topilmadi');
    if (vacancy.authorId !== userId) {
      throw new ForbiddenException('Siz bu vakansiyani tahrirlay olmaysiz');
    }
    await this.repo.update(id, dto);
    return this.findById(id);
  }

  // O'chirish
  async remove(id: string, userId: string): Promise<{ message: string }> {
    const vacancy = await this.repo.findOne({ where: { id } });
    if (!vacancy) throw new NotFoundException('Vakansiya topilmadi');
    if (vacancy.authorId !== userId) {
      throw new ForbiddenException('Siz bu vakansiyani o\'chira olmaysiz');
    }
    await this.repo.update(id, { status: VacancyStatus.CLOSED });
    return { message: 'Vakansiya yopildi' };
  }
}
