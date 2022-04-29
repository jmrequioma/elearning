export type User = {
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
};

export type Subject = {
	id: number;
	title: string;
	isPublished: boolean;
	createdAt: string;
	updatedAt: string;
	ownerId: number;
	courses?: Array<Course>;
};

export type Course = {
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
};

export type Module = {
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
};

export type Content = {
	id: number;
	content: string;
	type: string;
	isPublished: boolean;
	createdAt: string;
	updatedAt: string;
	authorId: number;
	moduleId: number;
};

export type Enrollment = {
	id: number;
	isStarted: boolean;
	createdAt: string;
	updatedAt: string;
	userId: number;
	course: Course;
};

export type DataBody = {
	id?: number;
	subjectId?: number;
	courseId?: number;
	moduleId?: number;
	title?: string;
	isPublished?: boolean;
	duration?: number;
	description?: string;
	full?: boolean;
};

export type LoginBody = {
	email: string;
	password: string;
};

export type SignUpBody = {
	email: string;
	password: string;
	verifyPassword: string;
	role: string;
	firstName: string;
	lastName: string;
};

export type ChangePasswordBody = {
	currPassword: string;
	password: string;
	verifyPassword: string;
};

export type MockStorage = {
	[key: string]: string;
};

export type EmitCourseAction = {
	courseId: number;
	enrollmentId?: number;
	action: string;
};
