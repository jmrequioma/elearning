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
		salt: faker.internet.password,
		firstName: String,
		lastName: String,
		role: String,
		isActive: Boolean,
		createdAt: String,
		updatedAt: String,
		accessToken: faker.datatype.uuid, // should be taken from the backend
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
		icon: String,
		isPublished: Boolean,
		createdAt: String,
		updatedAt: String,
		subjectId: Number,
		authorId: Number,
		// subject: {
		//   id: Number,
		//   title: String,
		// },
		// author: String,
		// duration: Number,
	},
};

export const db = factory(model);
export type Model = typeof model;

function seedUsers() {
	users.forEach((user) => {
		db.user.create({ ...user, id: user.id });
	});
}

function seedRelatedEntities() {
	const user = users[0];
	const courses: Entity<Model, 'course'>[] = [];

	// create 5 courses
	for (let i = 0; i < 5; i++) {
		const id = i + 1;
		const course = {
			id: id,
			title: `${faker.random.word()} Course`,
			description: faker.lorem.words(),
			icon: faker.image.imageUrl(),
			isPublished: true,
			createdAt: '2022-03-01T20:35:47.402Z',
			updatedAt: '2022-03-01T20:35:47.402Z',
			subjectId: 1,
			authorId: user.id,
		};
		const newCourse = db.course.create(course);
		courses.push(newCourse);
	}

	// create 100 subjects
	for (let i = 0; i < 100; i++) {
		let published = true;
		if (i % 2 != 0) {
			// make alternating published/draft statuses
			published = false;
		}
		const id = i + 1;
		db.subject.create({
			id: id,
			title: `${faker.unique(faker.random.word)} Subject`,
			isPublished: published,
			createdAt: '2022-03-01T20:35:47.402Z',
			updatedAt: '2022-03-01T20:35:47.402Z',
			ownerId: user.id,
			courses: courses,
		});
	}
}

function seed() {
	seedUsers();
	seedRelatedEntities();
}

seed();
