import { Module } from '@nestjs/common';
import { CoursesController } from './controllers/courses/courses.controller';
import { CoursesService } from './services/courses/courses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Tag } from './entities/tags.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Tag])],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
