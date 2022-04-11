import { rest } from 'msw';
import { API_URL } from '@/constants';
import { DELAY } from '@/mocks/constants';
import { db } from '@/mocks/db';
import { validateAuth } from '../utils';

const DEFAULT_LIMIT = 25;
const DEFAULT_PAGE = 1;

export const subjectHandlers = [
	rest.get(`${API_URL}/subjects`, (req, res, ctx) => {
		const auth = validateAuth(req);
		const limit = Number(req.url.searchParams.get('limit')) || DEFAULT_LIMIT;
		const page = Number(req.url.searchParams.get('page')) || DEFAULT_PAGE;
		const keyword = req.url.searchParams.get('keyword') || '';
		const published = req.url.searchParams.get('published') || '';

		const skip = (page - 1) * limit;

		if (auth.errorMessage) {
			return res(ctx.delay(DELAY), ctx.status(401), ctx.json(auth));
		}

		// return the list of subjects
		let query = {};

		if (keyword) {
			query = {
				...query,
				title: {
					contains: keyword,
				},
			};
		}

		if (published) {
			query = {
				...query,
				isPublished: {
					equals: published === 'true',
				},
			};
		}

		const subjects = db.subject.findMany({
			take: limit,
			skip,
			where: query,
			orderBy: {
				title: 'asc',
			},
		});

		const totalCount = db.subject.count({ where: query });

		const response = {
			data: subjects,
			page,
			limit,
			totalCount,
		};

		return res(ctx.delay(DELAY), ctx.status(200), ctx.json(response));
	}),
];
