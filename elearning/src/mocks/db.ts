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
});

function seedUsers() {
	users.forEach((user) => {
		db.user.create({ ...user, id: user.id });
	});
}

function seed() {
	seedUsers();
}

seed();
