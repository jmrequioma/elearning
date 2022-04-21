import { rest } from 'msw';
import { API_URL } from '@/constants';
import { DELAY, DEFAULT_LIMIT, DEFAULT_PAGE } from '@/mocks/constants';
import { db } from '@/mocks/db';
import { validateAuth, extractAccessToken, checkAuth } from '../utils';
import faker from '@faker-js/faker';

export const contentHandlers = [
	// create content
	rest.post(`${API_URL}/contents`, (req, res, ctx) => {
		const auth = validateAuth(req);
		const accessToken = extractAccessToken(req) as string;
		const loggedInUser = checkAuth(accessToken);

		if (auth.errorMessage) {
			return res(ctx.delay(DELAY), ctx.status(401), ctx.json(auth));
		}

		const data = req.body as {
			id: number;
			content: string;
		};

		const date = new Date().toISOString();

		const lastId = db.content.count();
		const newContent = db.content.create({
			id: lastId + 1,
			content: data.content,
			type: 'delta',
			isPublished: true,
			createdAt: date,
			updatedAt: date,
			authorId: loggedInUser?.id,
			moduleId: data.id,
		});

		return res(ctx.delay(DELAY), ctx.json(newContent));
	}),
];
