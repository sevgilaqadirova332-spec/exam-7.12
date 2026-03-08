import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resume, ResumeStatus } from './resume.entity';
import { CreateResumeDto, UpdateResumeDto } from './dto/resume.dto';

@Injectable()
export class ResumesService {
  constructor(
    @InjectRepository(Resume)
    private repo: Repository<Resume>,
  ) {}

  // Barcha ochiq rezyumeler (ish beruvchilar uchun)
  findAll(): Promise<Resume[]> {
    return this.repo.find({
      where: { status: ResumeStatus.ACTIVE },
      relations: ['owner'],
      order: { updatedAt: 'DESC' },
    });
  }

  // Bitta rezyume
  async findById(id: string): Promise<Resume> {
    const resume = await this.repo.findOne({ where: { id }, relations: ['owner'] });
    if (!resume) throw new NotFoundException('Rezyume topilmadi');
    return resume;
  }

  // Foydalanuvchining o'z rezyumelari
  findByOwner(ownerId: string): Promise<Resume[]> {
    return this.repo.find({ where: { ownerId }, order: { createdAt: 'DESC' } });
  }

  // Yaratish
  create(dto: CreateResumeDto, ownerId: string): Promise<Resume> {
    const resume = this.repo.create({ ...dto, ownerId });
    return this.repo.save(resume);
  }

  // Yangilash
  async update(id: string, dto: UpdateResumeDto, userId: string): Promise<Resume> {
    const resume = await this.repo.findOne({ where: { id } });
    if (!resume) throw new NotFoundException('Rezyume topilmadi');
    if (resume.ownerId !== userId) throw new ForbiddenException('Bu rezyume sizniki emas');
    await this.repo.update(id, dto);
    return this.findById(id);
  }

  // O'chirish
  async remove(id: string, userId: string): Promise<{ message: string }> {
    const resume = await this.repo.findOne({ where: { id } });
    if (!resume) throw new NotFoundException('Rezyume topilmadi');
    if (resume.ownerId !== userId) throw new ForbiddenException('Bu rezyume sizniki emas');
    await this.repo.delete(id);
    return { message: 'Rezyume o\'chirildi' };
  }
}
