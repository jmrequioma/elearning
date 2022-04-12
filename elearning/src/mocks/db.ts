import faker from '@faker-js/faker';
import { factory, primaryKey } from '@mswjs/data';
import { users } from './mockedData';

export const db = factory({
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
	},
});

function seedUsers() {
	users.forEach((user) => {
		db.user.create({ ...user, id: user.id });
	});
}

function seedSubjects() {
	const user = users[0];

	// create 10 subjects
	for (let i = 0; i < 100; i++) {
		const id = i + 1;
		db.subject.create({
			id: id,
			title: faker.random.words(2),
			isPublished: true,
			createdAt: '2022-03-01T20:35:47.402Z',
			updatedAt: '2022-03-01T20:35:47.402Z',
			ownerId: user.id,
		});
	}
}

function seed() {
	seedUsers();
	seedSubjects();
}

seed();
