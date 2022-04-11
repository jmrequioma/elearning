import { authHandlers } from './auth';
import { subjectHandlers } from './subject';

export const handlers = [...authHandlers, ...subjectHandlers];
