import { authHandlers } from './auth';
import { subjectHandlers } from './subject';
import { courseHandlers } from './course';
import { moduleHandlers } from './module';
import { contentHandlers } from './content';
import { userHandlers } from './user';

export const handlers = [
	...authHandlers,
	...subjectHandlers,
	...courseHandlers,
	...moduleHandlers,
	...contentHandlers,
	...userHandlers,
];
