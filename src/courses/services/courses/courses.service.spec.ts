import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course } from 'src/courses/entities/course.entity';
import { Tag } from 'src/courses/entities/tags.entity';
import { randomUUID } from 'crypto';
import { UpdateCourseDto } from 'src/courses/dto/update-course.dto/update-course.dto';
import { NotFoundException } from '@nestjs/common';

describe('CoursesService', () => {
  let service: CoursesService;

  let id: string = randomUUID();
  let mockCourseRepository: any;
  let mockTagRepository: any;

  const expecOutputTags = {
    id,
    name: 'angular',
    created_at: Date.now(),
  };

  const expectOutputCourses = {
    id,
    name: 'Curso de angular 18',
    description: 'Novas atualizações do angular na versao 18 ',
    tags: [expecOutputTags],
    created_at: Date.now(),
  };

  const expectOutputUpdatedCourse = {
    id,
    name: 'Curso de angular',
    description: 'Atualizações do angular na versao 18 ',
    tags: [expecOutputTags],
    created_at: Date.now(),
  };

  beforeEach(async () => {
    id = randomUUID();

    mockCourseRepository = {
      find: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourses)),
      findOne: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourses)),
      save: jest
        .fn()
        .mockReturnValue(Promise.resolve(expectOutputUpdatedCourse)),
      create: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourses)),
      remove: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourses)),
    };

    mockTagRepository = {
      find: jest.fn().mockReturnValue(Promise.resolve(expecOutputTags)),
      findOne: jest.fn().mockReturnValue(Promise.resolve(expecOutputTags)),
      save: jest.fn().mockReturnValue(Promise.resolve(expecOutputTags)),
      create: jest.fn().mockReturnValue(Promise.resolve(expecOutputTags)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: getRepositoryToken(Course),
          useValue: mockCourseRepository,
        },
        {
          provide: getRepositoryToken(Tag),
          useValue: mockTagRepository,
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);

    service.preloadTagByName = jest.fn().mockResolvedValue(expecOutputTags);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should list all courses', async () => {
    //@ts-expect-error defined part of methods
    service['courseRepository'] = mockCourseRepository;

    const courses = await service.findAll();

    expect(courses).toStrictEqual(expectOutputCourses);
    expect(mockCourseRepository.find).toHaveBeenCalled();
    await expect(service.findAll()).resolves.toStrictEqual(expectOutputCourses);
  });

  it('should list one course', async () => {
    //@ts-expect-error defined part of methods
    service['courseRepository'] = mockCourseRepository;

    const course = await service.findOne(id);

    expect(course).toStrictEqual(expectOutputCourses);
    expect(mockCourseRepository.findOne).toHaveBeenCalled();
    await expect(service.findAll()).resolves.toStrictEqual(expectOutputCourses);
  });

  it('should update a course', async () => {
    //@ts-expect-error defined part of methods
    service['courseRepository'] = mockCourseRepository;

    const updatedCourseDto: UpdateCourseDto = {
      name: 'Curso de angular',
      description: 'Atualizações do angular na versao 18 ',
      tags: ['angular'],
    };

    const courseUpdated = await service.update(id, updatedCourseDto);

    expect(courseUpdated).toStrictEqual(expectOutputUpdatedCourse);
    expect(service.preloadTagByName).toHaveBeenCalled();
    expect(mockCourseRepository.findOne).toHaveBeenCalled();
    expect(mockCourseRepository.save).toHaveBeenCalled();
  });

  it('should throw NotFoundException if course does not exist', async () => {
    const updatedCourseDto: UpdateCourseDto = {
      name: 'Curso de angular',
      description: 'Atualizações do angular na versao 18 ',
      tags: ['angular'],
    };

    mockCourseRepository.findOne.mockReturnValueOnce(undefined);
    await expect(service.update(id, updatedCourseDto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should remove a course', async () => {
    //@ts-expect-error defined part of methods
    service['courseRepository'] = mockCourseRepository;

    const course = await service.remove(id);

    expect(course).toStrictEqual(expectOutputCourses);

    expect(mockCourseRepository.remove).toHaveBeenCalled();
    expect(mockCourseRepository.findOne).toHaveBeenCalled();

    await expect(service.findAll()).resolves.toStrictEqual(expectOutputCourses);
  });

  it('should create an course', async () => {
    //@ts-expect-error defined part of methods
    service['courseRepository'] = mockCourseRepository;

    //@ts-expect-error defined part of methods
    service['tagRepository'] = mockTagRepository;

    const createCourseDto = {
      name: 'Curso de angular 18',
      description: 'Novas atualizações do angular na versao 18 ',
      tags: ['angular'],
    };

    const course = await service.create(createCourseDto);

    expect(mockCourseRepository.save).toHaveBeenCalled();
    expect(course).toStrictEqual(expectOutputCourses);

    await expect(service.create(createCourseDto)).resolves.toStrictEqual(
      expectOutputCourses,
    );
  });
});
