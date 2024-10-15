import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCourseDto {
  @ApiProperty({ description: 'Course name' })
  @Optional()
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'Course description' })
  @Optional()
  @IsString()
  readonly description: string;

  @ApiProperty({ description: 'Tags associadas ao curso' })
  @Optional()
  @IsString({ each: true })
  readonly tags?: string[];
}
