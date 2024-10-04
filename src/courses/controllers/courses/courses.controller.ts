import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateCourseDto } from 'src/courses/dto/create-course.dto/create-course.dto';
import { UpdateCourseDto } from 'src/courses/dto/update-course.dto/update-course.dto';
import { CoursesService } from 'src/courses/services/courses/courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coureService: CoursesService) {}

  @Get()
  @HttpCode(HttpStatus.ACCEPTED)
  async findAll() {
    const data = await this.coureService.findAll();
    console.log(data);

    const response = {
      status: 202,
      message: 'Lista encontrada com sucesso',
      data: data,
    };

    return response;
  }

  @Get('one/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  findOne(@Param('id') param) {
    const data = this.coureService.findOne(param);

    const response = {
      status: 202,
      message: 'Registro encontrado com sucesso',
      data: data,
    };

    return response;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() param: CreateCourseDto) {
    await this.coureService.create(param);

    const data = {
      status: 204,
      message: 'Registro criado',
      data: param,
    };

    return data;
  }

  @Patch('update/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  update(@Param('id') id, @Body() updateCourseDto: UpdateCourseDto) {
    this.coureService.update(id, updateCourseDto);

    const data = {
      status: 202,
      message: 'Registro alterado com sucesso',
      data: updateCourseDto,
    };

    return data;
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  delete(@Param('id') id) {
    this.coureService.remove(Number(id));
    console.log(id, typeof id);

    const data = {
      status: 202,
      message: 'Registro deletado com sucesso',
      data: 'Deletado',
    };

    return data;
  }
}
