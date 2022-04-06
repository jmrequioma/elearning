import { rest } from 'msw';
import { API_URL } from '@/constants';
import { users } from '../mockedData';
import { DELAY } from '@/mocks/constants';
import { db } from '@/mocks/db';

interface LoginBody {
	email: string;
	password: string;
}

interface SignUpBody {
	email: string;
	password: string;
	verifyPassword: string;
	role: string;
	firstName: string;
	lastName: string;
}

export const authHandlers = [
	rest.post<LoginBody>(`${API_URL}/user`, (req, res, ctx) => {
		const user = db.user.findFirst({
			where: {
				email: {
					equals: req.body.email,
				},
				password: {
					equals: req.body.password,
				},
			},
		});
		if (user) {
			return res(
				ctx.delay(DELAY),
				ctx.status(200),
				ctx.json({
					...user,
				})
			);
		} else {
			// return 401
			return res(
				ctx.delay(DELAY),
				ctx.status(401),
				ctx.json({
					errorMessage: 'Invalid credentials.',
				})
			);
		}
	}),

	rest.post<SignUpBody>(`${API_URL}/signup`, (req, res, ctx) => {
		const foundUser = db.user.findFirst({
			where: {
				email: {
					equals: req.body.email,
				},
			},
		});

		if (foundUser) {
			return res(
				ctx.delay(DELAY),
				ctx.status(200),
				ctx.json({ errorMessage: 'The email is already registered.' })
			);
		} else {
			// create new user
			const newUser = createUser(req.body);
			return res(
				ctx.delay(DELAY),
				ctx.status(201),
				ctx.json({
					...newUser,
				})
			);
		}
	}),

	rest.get(`${API_URL}/me`, (req, res, ctx) => {
		const user = getUserDetails('accessToken1');
		if (user) {
			return res(
				ctx.delay(DELAY),
				ctx.status(200),
				ctx.json({
					...user,
				})
			);
		} else {
			// return 401
			return res(ctx.delay(DELAY), ctx.status(401));
		}
	}),
];

function getUserDetails(accessToken: string) {
	// do a simple checking just to return mocked data
	// implementation of this should be done at backend
	const foundUser = users.find((user) => user.accessToken === accessToken);

	return foundUser;
}

function createUser(body: SignUpBody) {
	const { email, password, role, firstName, lastName } = body;

	const date = new Date().toISOString();

	const data = {
		id: db.user.count() + 1, // increment id
		email: email,
		password: password,
		firstName: firstName,
		lastName: lastName,
		role: role,
		isActive: true,
		createdAt: date,
		updatedAt: date,
	};
	// create user
	db.user.create(data);
	return {
		...body,
	};
}
