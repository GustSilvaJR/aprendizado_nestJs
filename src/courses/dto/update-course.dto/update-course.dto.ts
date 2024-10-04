import { IsString } from 'class-validator';
import { Tag } from 'src/courses/entities/tags.entity';

export class UpdateCourseDto {
  @IsString()
  readonly name?: string;

  @IsString()
  readonly description?: string;

  @IsString({ each: true })
  readonly tags?: Tag[];
}
