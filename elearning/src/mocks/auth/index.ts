import { rest } from 'msw';
import { API_URL } from '@/constants';
import { users } from '../mockedData';
import { DELAY } from '@/mocks/constants';

interface LoginBody {
	email: string;
	password: string;
}

export const authHandlers = [
	rest.post<LoginBody>(`${API_URL}/user`, (req, res, ctx) => {
		const { email, password } = req.body;
		const user = checkUser(email, password);
		return res(
			ctx.delay(DELAY),
			ctx.status(200),
			ctx.json({
				...user,
			})
		);
	}),

	rest.get(`${API_URL}/me`, (req, res, ctx) => {
		const user = getUserDetails('accessToken1');
		return res(
			ctx.delay(DELAY),
			ctx.status(200),
			ctx.json({
				...user,
			})
		);
	}),
];

function checkUser(email: string, password: string) {
	// do a simple checking just to return mocked data
	// implementation of this should be done at backend
	const foundUser = users.find(
		(user) => user.email === email && user.password === password
	);

	return foundUser;
}

function getUserDetails(accessToken: string) {
	// do a simple checking just to return mocked data
	// implementation of this should be done at backend
	const foundUser = users.find((user) => user.accessToken === accessToken);

	return foundUser;
}
