import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCourseDto } from '../../dto/create-course.dto/create-course.dto';
import { UpdateCourseDto } from '../../dto/update-course.dto/update-course.dto';

import { Course } from '../../entities/course.entity';
import { Tag } from '../../entities/tags.entity';
import { UnauthorizedError } from 'src/common/errors/UnauthorizedError';
import { NotFoundError } from 'src/common/errors/NotFoundError';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async findAll() {
    throw new UnauthorizedError('Nao autorizado.');
    return await this.courseRepository.find({ relations: ['tags'] });
  }

  async findOne(id: string) {
    const course = await this.courseRepository.findOne({
      where: { id: id },
      relations: ['tags'],
    });

    if (!course) {
      throw new NotFoundError('Curso não encontrado');
    }

    return course ? course : 'Nenhum registro encontrado';
  }

  async create(createCourseDto: CreateCourseDto) {
    const tags = await Promise.all(
      createCourseDto.tags.map((tag: string) => this.preloadTagByName(tag)),
    );

    const courseObject = {
      ...createCourseDto,
      tags,
    };

    const course = this.courseRepository.create(courseObject);

    return await this.courseRepository.save(course);
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const existingCourse = await this.courseRepository.findOne({
      where: { id },
      relations: ['tags'],
    });

    if (!existingCourse) {
      throw new NotFoundException(`Course ID ${id} not found`);
    }

    if (updateCourseDto.tags) {
      const tags = await Promise.all(
        updateCourseDto.tags.map(
          async (tag: string) => await this.preloadTagByName(tag),
        ),
      );
      existingCourse.tags = tags;
    }

    if (updateCourseDto.name) {
      existingCourse.name = updateCourseDto.name;
    }

    if (updateCourseDto.description) {
      existingCourse.description = updateCourseDto.description;
    }

    return await this.courseRepository.save(existingCourse);
  }

  async remove(id: string) {
    const course = await this.courseRepository.findOne({
      where: { id: id },
    });

    if (!course) {
      throw new NotFoundException(`Course ID ${id} not found`);
    }

    return await this.courseRepository.remove(course);
  }

  public async preloadTagByName(name: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({ where: { name } });

    if (tag) {
      return tag;
    }

    const newTag = this.tagRepository.create({ name });
    return await this.tagRepository.save(newTag);
  }
}
