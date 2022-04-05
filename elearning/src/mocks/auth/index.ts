import { rest } from 'msw';
import { API_URL } from '@/constants';
import { users } from '../mockedData';
import { DELAY } from '@/mocks/constants';

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
		const user = checkUser(req.body);
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
		const foundUser = checkExistingEmail(req.body);

		if (foundUser) {
			return res(
				ctx.delay(DELAY),
				ctx.status(200),
				ctx.json({ message: 'The email is already registered.' })
			);
		} else {
			const newUser = createUser(req.body);
			return res(
				ctx.delay(DELAY),
				ctx.status(200),
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

function checkUser(body: LoginBody) {
	// do a simple checking just to return mocked data
	// implementation of this should be done at backend
	const { email, password } = body;
	const foundUser = users.find(
		(user) => user.email === email && user.password === password
	);

	return foundUser;
}

function checkExistingEmail(body: LoginBody) {
	// do a simple checking just to return mocked data
	// implementation of this should be done at backend
	const { email } = body;
	const foundUser = users.find((user) => user.email === email);

	return foundUser;
}

function getUserDetails(accessToken: string) {
	// do a simple checking just to return mocked data
	// implementation of this should be done at backend
	const foundUser = users.find((user) => user.accessToken === accessToken);

	return foundUser;
}

function createUser(body: SignUpBody) {
	const { email, password, verifyPassword, role, firstName, lastName } = body;

	return {
		email: email,
		password: password,
		verifyPassword: verifyPassword,
		role: role,
		firstName: firstName,
		lastName: lastName,
	};
}
