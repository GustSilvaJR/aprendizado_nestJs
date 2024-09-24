import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCourseDto } from 'src/courses/dto/create-course.dto/create-course.dto';
import { UpdateCourseDto } from 'src/courses/dto/update-course.dto/update-course.dto';
import { Course } from 'src/courses/entities/course.entity';

@Injectable()
export class CoursesService {
  private courses: any[] = [
    {
      name: 'Curso para aprender a vender curso',
      description: 'Curso perfeito para quem quer ser tapeado',
      tags: ['Chorume', 'Faz o M'],
    },
  ];

  findAll() {
    return this.courses;
  }

  findOne(id: number) {
    const course = this.courses.find(
      (course: Course) => course.id === Number(id),
    );

    if (!course) {
      throw new HttpException(
        `Curso com ID ${id} não encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }

    return course ? course : 'Nenhum registro encontrado';
  }

  create(createCourseDto: CreateCourseDto) {
    this.courses.push(createCourseDto);
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    const existingIndexCourse = this.courses.findIndex(
      (course: Course) => course.id === Number(id),
    );

    if (existingIndexCourse > 0) {
      this.courses[existingIndexCourse] = updateCourseDto;
    }
  }

  remove(id: number) {
    const existingIndexCourse = this.courses.findIndex(
      (course: Course) => course.id === Number(id),
    );

    if (existingIndexCourse >= 0) {
      this.courses.splice(Number(existingIndexCourse), 1);
    }
  }
}
