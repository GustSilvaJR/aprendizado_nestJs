import { CreateTagsTable1728445486109 } from '../migrations/1728445486109-CreateTagsTable';
import { CreateCoursesTable1728441135946 } from '../migrations/1728441135946-CreateCoursesTable';
import { CreateCourseTagsTable1728519178552 } from '../migrations/1728519178552-CreateCourseTagsTable';
import { AddCoursesIdToTableCoursesTags1728519700578 } from '../migrations/1728519700578-AddCoursesIdToTableCoursesTags';
import { AddTagsIdToTableCoursesTags1728520695982 } from '../migrations/1728520695982-AddTagsIdToTableCoursesTags';

import { dataSourceOptions } from './database.module';
import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  ...dataSourceOptions,
  synchronize: false,
  migrations: [
    CreateCoursesTable1728441135946,
    CreateTagsTable1728445486109,
    CreateCourseTagsTable1728519178552,
    AddCoursesIdToTableCoursesTags1728519700578,
    AddTagsIdToTableCoursesTags1728520695982,
  ],
});
