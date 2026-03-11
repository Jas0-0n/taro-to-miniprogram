import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { NotesService } from './notes.service';
import { Note } from './entities/note.entity';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.notesService.findAll(page, size, startDate, endDate);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.notesService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Note>) {
    return this.notesService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Note>) {
    return this.notesService.update(id, data);
  }

  @Delete('batch')
  removeBatch(@Body('ids') ids: number[]) {
    return this.notesService.removeBatch(ids);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.notesService.remove(id);
  }
}
