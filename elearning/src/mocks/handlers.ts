import { authHandlers } from './auth';
import { subjectHandlers } from './subject';
import { courseHandlers } from './course';

export const handlers = [
	...authHandlers,
	...subjectHandlers,
	...courseHandlers,
];
