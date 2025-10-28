// ----------------------------------------------------------------------

import { Schema } from '../../amplify/data/resource';

export type FileData = Schema['FileData']['type'];

export type FileDataWithUrl = FileData & {
  url: string;
};
