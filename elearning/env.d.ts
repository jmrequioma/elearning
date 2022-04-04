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

type LoginBody = {
	email: string;
	password: string;
};
