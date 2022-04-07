import { rest } from 'msw';
import { API_URL } from '@/constants';
import { users } from '../mockedData';
import { DELAY } from '@/mocks/constants';
import { db } from '@/mocks/db';
import { checkAuth, extractAccessToken } from '../utils';

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

interface ChangePasswordBody {
	currPassword: string;
	password: string;
	verifyPassword: string;
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
		if (!user) {
			// return 401
			return res(
				ctx.delay(DELAY),
				ctx.status(401),
				ctx.json({
					errorMessage: 'Invalid credentials.',
				})
			);
		}

		return res(
			ctx.delay(DELAY),
			ctx.status(200),
			ctx.json({
				...user,
			})
		);
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
		}
		// create new user
		const newUser = createUser(req.body);
		return res(
			ctx.delay(DELAY),
			ctx.status(201),
			ctx.json({
				...newUser,
			})
		);
	}),

	// request a password reset
	rest.get(`${API_URL}/password`, (req, res, ctx) => {
		const email = req.url.searchParams.get('email');
		const foundUser = db.user.findFirst({
			where: {
				email: {
					equals: email as string,
				},
			},
		});
		if (!foundUser) {
			return res(
				ctx.delay(DELAY),
				ctx.status(404),
				ctx.json({
					errorMessage: 'Email was not found in our records.',
				})
			);
		}

		return res(
			ctx.delay(DELAY),
			ctx.status(200),
			ctx.json({
				status: 'success',
			})
		);
	}),

	// change password
	rest.post<ChangePasswordBody>(`${API_URL}/password`, (req, res, ctx) => {
		const accessToken = extractAccessToken(req);

		if (!accessToken) {
			return res(
				ctx.delay(DELAY),
				ctx.status(401),
				ctx.json({
					errorMessage: 'No token provided.',
				})
			);
		}

		const user = checkAuth(accessToken);

		if (!user) {
			return res(
				ctx.delay(DELAY),
				ctx.status(401),
				ctx.json({
					errorMessage: 'Unauthorized user.',
				})
			);
		}

		// check if password provided matches with the one on the db
		const passwordMatch = db.user.findFirst({
			where: {
				password: {
					equals: req.body.currPassword,
				},
			},
		});

		if (!passwordMatch) {
			return res(
				ctx.delay(DELAY),
				ctx.status(200),
				ctx.json({
					errorMessage: 'Current password is incorrect.',
				})
			);
		}

		// change the password
		db.user.update({
			where: {
				accessToken: {
					equals: accessToken,
				},
			},
			data: {
				password: req.body.password,
			},
		});

		return res(
			ctx.delay(DELAY),
			ctx.status(200),
			ctx.json({
				status: 'success',
			})
		);
	}),

	rest.get(`${API_URL}/me`, (req, res, ctx) => {
		const user = getUserDetails('accessToken1');
		if (!user) {
			// return 401
			return res(ctx.delay(DELAY), ctx.status(401));
		}

		return res(
			ctx.delay(DELAY),
			ctx.status(200),
			ctx.json({
				...user,
			})
		);
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
		isActive: false,
		createdAt: date,
		updatedAt: date,
	};
	// create user
	db.user.create(data);
	return {
		...body,
	};
}
