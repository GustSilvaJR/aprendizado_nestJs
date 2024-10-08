import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCourseDto } from 'src/courses/dto/create-course.dto/create-course.dto';
import { UpdateCourseDto } from 'src/courses/dto/update-course.dto/update-course.dto';

import { Course } from 'src/courses/entities/course.entity';
import { Tag } from 'src/courses/entities/tags.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  private courses: any[] = [
    {
      name: 'Curso para aprender a vender curso',
      description: 'Curso perfeito para quem quer ser tapeado',
      tags: ['Chorume', 'Faz o M'],
    },
  ];

  async findAll() {
    return await this.courseRepository.find({ relations: ['tags'] });
  }

  async findOne(id: number) {
    const course = await this.courseRepository.findOne({
      where: { id: id },
      relations: ['tags'],
    });

    if (!course) {
      throw new HttpException(
        `Curso com ID ${id} não encontrado`,
        HttpStatus.NOT_FOUND,
      );
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

  async update(id: number, updateCourseDto: UpdateCourseDto) {
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

  async remove(id: number) {
    const course = await this.courseRepository.findOne({
      where: { id: id },
    });

    if (!course) {
      throw new NotFoundException(`Course ID ${id} not found`);
    }

    return await this.courseRepository.remove(course);
  }

  private async preloadTagByName(name: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({ where: { name } });

    if (tag) {
      return tag;
    }

    const newTag = this.tagRepository.create({ name });
    return await this.tagRepository.save(newTag);
  }
}
