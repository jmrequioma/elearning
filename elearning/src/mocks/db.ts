import faker from '@faker-js/faker';
import { factory, primaryKey, manyOf } from '@mswjs/data';
import type { Entity } from '@mswjs/data/lib/glossary';
import { users } from './mockedData';

const model = {
	// Create a "user" model,
	user: {
		id: primaryKey(Number),
		email: String,
		password: String,
		salt: String,
		firstName: String,
		lastName: String,
		role: String,
		isActive: Boolean,
		createdAt: String,
		updatedAt: String,
		accessToken: String, // should be taken from the backend
	},

	subject: {
		id: primaryKey(Number),
		title: String,
		isPublished: Boolean,
		createdAt: String,
		updatedAt: String,
		ownerId: Number,
		courses: manyOf('course'),
	},

	course: {
		id: primaryKey(Number),
		title: String,
		description: String,
		duration: Number,
		icon: String,
		isPublished: Boolean,
		createdAt: String,
		updatedAt: String,
		subjectId: Number,
		authorId: Number,
		modules: manyOf('module'),
	},

	module: {
		id: primaryKey(Number),
		title: String,
		duration: Number,
		isPublished: Boolean,
		createdAt: String,
		updatedAt: String,
		authorId: Number,
		courseId: Number,
		contents: manyOf('content'),
	},

	content: {
		id: primaryKey(Number),
		content: String,
		type: String,
		isPublished: Boolean,
		createdAt: String,
		updatedAt: String,
		authorId: Number,
		moduleId: Number,
	},
};

export const db = factory(model);
export type Model = typeof model;

function seedUsers() {
	users.forEach((user) => {
		db.user.create({ ...user, id: user.id });
	});
}

function seedContent(moduleId: number) {
	const contentId = db.content.count() + 1;
	const newContent = db.content.create({
		id: contentId,
		content: `{"ops":[{"insert":"Introduction"},{"attributes":{"header":1},"insert":"\\n"},
		{"insert":"\\nhello all\\n\\n\\n\\n"}]}`,
		type: 'text',
		isPublished: true,
		createdAt: '2022-03-01T20:35:47.402Z',
		updatedAt: '2022-03-01T20:35:47.402Z',
		authorId: users[1].id,
		moduleId: moduleId,
	});

	return newContent;
}

function seedModules(moduleCount: number, courseId: number) {
	const modules = [];
	for (let i = 0; i < moduleCount; i++) {
		const moduleId = db.module.count() + 1;
		const newContent = seedContent(moduleId);
		const module = {
			id: moduleId,
			title: `${faker.random.word()} ${moduleId} Module`,
			duration: faker.datatype.number({ min: 1, max: 100 }),
			isPublished: true,
			createdAt: '2022-03-01T20:35:47.402Z',
			updatedAt: '2022-03-01T20:35:47.402Z',
			authorId: users[1].id,
			courseId: courseId,
			contents: [newContent],
		};
		const newModule = db.module.create(module);
		modules.push(newModule);
	}
	return modules;
}

function seedRelatedEntities() {
	const instructor = users[1];
	let modules: Entity<Model, 'module'>[] = [];
	let courses: Entity<Model, 'course'>[] = [];

	// create 25 subjects
	for (let i = 0; i < 25; i++) {
		let published = true;
		if (i % 2 != 0) {
			// make alternating published/draft statuses
			published = false;
		}
		const subjectId = i + 1;

		// create 5 courses
		for (let j = 0; j < 5; j++) {
			const courseId = db.course.count() + 1;
			// create 3 modules
			modules = seedModules(3, courseId);
			const course = {
				id: courseId,
				title: `${faker.random.word()} ${courseId} Course`,
				description: faker.lorem.words(),
				duration: faker.datatype.number({ min: 1, max: 100 }),
				icon: faker.image.imageUrl(),
				isPublished: true,
				createdAt: '2022-03-01T20:35:47.402Z',
				updatedAt: '2022-03-01T20:35:47.402Z',
				subjectId: subjectId,
				authorId: instructor.id,
				modules: modules,
			};
			const newCourse = db.course.create(course);
			courses.push(newCourse);
		}

		db.subject.create({
			id: subjectId,
			title: `${faker.unique(faker.random.word)} Subject`,
			isPublished: published,
			createdAt: '2022-03-01T20:35:47.402Z',
			updatedAt: '2022-03-01T20:35:47.402Z',
			ownerId: instructor.id,
			courses: courses,
		});
		// empty up courses
		courses = [];
	}
}

function seed() {
	seedUsers();
	seedRelatedEntities();
}

seed();
