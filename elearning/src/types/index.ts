export interface User {
	accessToken: string;
	id: number;
	email: string;
	password?: string;
	salt?: string;
	firstName: string;
	lastName: string;
	role: string;
	isActive: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface Subject {
	id: number;
	title: string;
	isPublished: boolean;
	createdAt: string;
	updatedAt: string;
	ownerId: number;
	courses?: Array<Course>;
}

export interface Course {
	id: number;
	title: string;
	description: string;
	duration: number;
	icon: string;
	isPublished: boolean;
	createdAt: string;
	updatedAt: string;
	subjectId: number;
	authorId: number;
	author?: string;
	subject?: Subject;
	modules?: Array<Module>;
}

export interface Module {
	id: number;
	title: string;
	duration: number;
	description: string;
	isPublished: boolean;
	createdAt: string;
	updatedAt: string;
	authorId: number;
	courseId: number;
	courseTitle: string;
	contents?: Array<Content>;
}

export interface Content {
	id: number;
	content: string;
	type: string;
	isPublished: boolean;
	createdAt: string;
	updatedAt: string;
	authorId: number;
	moduleId: number;
}

export interface Enrollment {
	id: number;
	isStarted: boolean;
	createdAt: string;
	updatedAt: string;
	userId: number;
	course: Course;
}

export interface DataBody {
	id?: number;
	subjectId?: number;
	courseId?: number;
	moduleId?: number;
	title?: string;
	isPublished?: boolean;
	duration?: number;
	description?: string;
	full?: boolean;
}

export interface LoginBody {
	email: string;
	password: string;
}

export interface SignUpBody {
	email: string;
	password: string;
	verifyPassword: string;
	role: string;
	firstName: string;
	lastName: string;
}

export interface ChangePasswordBody {
	currPassword: string;
	password: string;
	verifyPassword: string;
}

export interface MockStorage {
	[key: string]: string;
}

export interface EmitCourseAction {
	courseId: number;
	enrollmentId?: number;
	action: string;
}
