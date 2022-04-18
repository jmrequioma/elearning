export type User = {
	accessToken: string;
	id: number;
	email: string;
	password: string;
	salt: string;
	firstName: string;
	lastName: string;
	role: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
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
};

export type SubjectBody = {
	id?: number;
	title?: string;
	isPublished?: boolean;
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
