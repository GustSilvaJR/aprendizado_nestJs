import { Optional } from '@nestjs/common';
import { IsString } from 'class-validator';

export class UpdateCourseDto {
  @Optional()
  @IsString()
  readonly name: string;

  @Optional()
  @IsString()
  readonly description: string;

  @Optional()
  @IsString({ each: true })
  readonly tags?: string[];
}
