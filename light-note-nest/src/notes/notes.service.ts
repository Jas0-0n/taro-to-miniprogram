import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Note } from './entities/note.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly notesRepository: Repository<Note>,
  ) {}

  async findAll(page = 1, size = 10, startDate?: string, endDate?: string) {
    const where: any = {};
    if (startDate && endDate) {
      where.date = Between(startDate, endDate);
    } else if (startDate) {
      where.date = startDate;
    }

    const [list, total] = await this.notesRepository.findAndCount({
      where,
      order: { date: 'DESC', createTime: 'DESC' },
      skip: (page - 1) * size,
      take: size,
    });

    return { list, total };
  }

  async findOne(id: number) {
    const note = await this.notesRepository.findOne({ where: { id } });
    if (!note) throw new NotFoundException('Note not found');
    return note;
  }

  async create(data: Partial<Note>) {
    const note = this.notesRepository.create(data);
    return this.notesRepository.save(note);
  }

  async update(id: number, data: Partial<Note>) {
    await this.findOne(id);
    await this.notesRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    const note = await this.findOne(id);
    await this.notesRepository.remove(note);
    return { success: true };
  }

  async removeBatch(ids: number[]) {
    await this.notesRepository.delete({ id: In(ids) });
    return { success: true };
  }
}
