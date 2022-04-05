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

function checkUser(email: string, password: string) {
	// do a simple checking just to return mocked data
	// implementation of this should be done at backend
	const foundUser = users.find(
		(user) => user.email === email && user.password === password
	);

	console.log(foundUser);

	return foundUser;
}

function getUserDetails(accessToken: string) {
	// do a simple checking just to return mocked data
	// implementation of this should be done at backend
	const foundUser = users.find((user) => user.accessToken === accessToken);

	return foundUser;
}
