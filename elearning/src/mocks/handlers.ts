import { authHandlers } from './auth';
import { subjectHandlers } from './subject';
import { courseHandlers } from './course';
import { moduleHandlers } from './module';

export const handlers = [
	...authHandlers,
	...subjectHandlers,
	...courseHandlers,
	...moduleHandlers,
];
