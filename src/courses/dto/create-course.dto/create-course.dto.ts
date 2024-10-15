import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ description: 'Course name' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'Course description' })
  @IsString()
  readonly description: string;

  @ApiProperty({ description: 'Tags associadas ao curso' })
  @IsString({ each: true })
  readonly tags: string[];
}
