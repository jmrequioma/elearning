/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_APP_TITLE: string;
	readonly VITE_APP_ROOT_API: string;
}

type User = {
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

type Subject = {
	id: number;
	title: string;
	isPublished: string;
	createdAt: string;
	updatedAt: string;
	ownerId: number;
};

type LoginBody = {
	email: string;
	password: string;
};

type SignUpBody = {
	email: string;
	password: string;
	verifyPassword: string;
	role: string;
	firstName: string;
	lastName: string;
};

type ChangePasswordBody = {
	currPassword: string;
	password: string;
	verifyPassword: string;
};
