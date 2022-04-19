import { rest } from 'msw';
import { API_URL } from '@/constants';
import { DELAY, DEFAULT_LIMIT, DEFAULT_PAGE } from '@/mocks/constants';
import { db } from '@/mocks/db';
import { checkAuth, validateAuth, extractAccessToken } from '../utils';

export const courseHandlers = [
	// get courses
	rest.get(`${API_URL}/courses`, (req, res, ctx) => {
		const auth = validateAuth(req);
		if (auth.errorMessage) {
			return res(ctx.delay(DELAY), ctx.status(401), ctx.json(auth));
		}
		const limit = Number(req.url.searchParams.get('limit')) || DEFAULT_LIMIT;
		const page = Number(req.url.searchParams.get('page')) || DEFAULT_PAGE;
		const keyword = req.url.searchParams.get('keyword') || '';
		const published = req.url.searchParams.get('published') || '';
		const subjectId = req.url.searchParams.get('subjectId') || '';
		const authorId = req.url.searchParams.get('authorId') || '';

		const skip = (page - 1) * limit;

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

		if (subjectId) {
			query = {
				...query,
				subjectId: {
					equals: Number(subjectId),
				},
			};
		}

		if (authorId) {
			query = {
				...query,
				authorId: {
					equals: Number(authorId),
				},
			};
		}

		const courses = db.course.findMany({
			take: limit,
			skip,
			where: query,
			orderBy: {
				title: 'asc',
			},
		});

		const totalCount = db.course.count({ where: query });

		const data = courses.map((course) => {
			const subject = db.subject.findFirst({
				where: { id: { equals: course.subjectId } },
			});
			const author = db.user.findFirst({
				where: { id: { equals: course.authorId } },
			});

			return {
				...course,
				subject,
				author: `${author?.firstName} ${author?.lastName}`,
			};
		});

		const response = {
			data,
			page,
			limit,
			totalCount,
		};

		return res(ctx.delay(DELAY), ctx.json(response));
	}),
];
