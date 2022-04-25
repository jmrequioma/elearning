import { rest } from 'msw';
import { API_URL } from '@/constants';
import { DELAY, DEFAULT_LIMIT, DEFAULT_PAGE } from '@/mocks/constants';
import { db } from '@/mocks/db';
import { validateAuth, extractAccessToken, checkAuth } from '../utils';

export const userHandlers = [
	// get users
	rest.get(`${API_URL}/users`, (req, res, ctx) => {
		const auth = validateAuth(req);
		if (auth.errorMessage) {
			return res(ctx.delay(DELAY), ctx.status(401), ctx.json(auth));
		}
		const limit = Number(req.url.searchParams.get('limit')) || DEFAULT_LIMIT;
		const page = Number(req.url.searchParams.get('page')) || DEFAULT_PAGE;
		const keyword = req.url.searchParams.get('keyword') || '';
		const role = req.url.searchParams.get('role') || '';

		let query = {};

		if (keyword) {
			query = {
				...query,
				firstName: {
					contains: keyword,
				},
			};
		}

		if (role) {
			query = {
				...query,
				role: {
					contains: role,
				},
			};
		}

		const skip = (page - 1) * limit;

		const users = db.user.findMany({
			take: limit,
			skip,
			where: query,
			orderBy: {
				firstName: 'asc',
			},
		});

		const totalCount = db.user.count({ where: query });

		const response = {
			data: users,
			page,
			limit,
			totalCount,
		};

		return res(ctx.delay(DELAY), ctx.json(response));
	}),
];
