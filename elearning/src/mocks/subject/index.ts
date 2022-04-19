import { rest } from 'msw';
import { API_URL } from '@/constants';
import { DELAY, DEFAULT_LIMIT, DEFAULT_PAGE } from '@/mocks/constants';
import { db } from '@/mocks/db';
import { checkAuth, validateAuth, extractAccessToken } from '../utils';

export const subjectHandlers = [
	// get subjects
	rest.get(`${API_URL}/subjects`, (req, res, ctx) => {
		const auth = validateAuth(req);
		if (auth.errorMessage) {
			return res(ctx.delay(DELAY), ctx.status(401), ctx.json(auth));
		}

		const limit = Number(req.url.searchParams.get('limit')) || DEFAULT_LIMIT;
		const page = Number(req.url.searchParams.get('page')) || DEFAULT_PAGE;
		const keyword = req.url.searchParams.get('keyword') || '';
		const published = req.url.searchParams.get('published') || '';

		const skip = (page - 1) * limit;

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

	// update subject
	rest.patch(`${API_URL}/subjects/:id`, (req, res, ctx) => {
		const auth = validateAuth(req);
		if (auth.errorMessage) {
			return res(ctx.delay(DELAY), ctx.status(401), ctx.json(auth));
		}
		const { title, isPublished } = req.body as {
			title: string;
			isPublished: boolean;
		};
		const id = Number(req.params.id);

		const date = new Date().toISOString();
		const newSubject = db.subject.update({
			where: { id: { equals: id } },
			data: { title, isPublished, updatedAt: date },
		});

		if (!newSubject) {
			return res(
				ctx.delay(DELAY),
				ctx.status(404),
				ctx.json({
					message: 'Subject not found.',
				})
			);
		}

		return res(ctx.delay(DELAY), ctx.json(newSubject));
	}),

	// add subject
	rest.post(`${API_URL}/subjects`, (req, res, ctx) => {
		const auth = validateAuth(req);
		const accessToken = extractAccessToken(req) as string;
		const loggedInUser = checkAuth(accessToken);

		if (auth.errorMessage) {
			return res(ctx.delay(DELAY), ctx.status(401), ctx.json(auth));
		}

		const { title } = req.body as { title: string };

		const existingSubject = db.subject.findFirst({
			where: {
				title: {
					equals: title,
				},
			},
		});

		if (existingSubject) {
			return res(
				ctx.delay(DELAY),
				ctx.status(409),
				ctx.json({
					errorMessage: 'Title must be unique.',
				})
			);
		}

		const lastId = db.subject.count();

		const date = new Date().toISOString();
		const subject = {
			id: lastId + 1,
			title,
			isPublished: false,
			createdAt: date,
			updatedAt: date,
			ownerId: loggedInUser?.id,
		};
		const newSubject = db.subject.create({ ...subject, courses: [] });
		return res(ctx.delay(DELAY), ctx.json(newSubject));
	}),

	// get subject
	rest.get(`${API_URL}/subjects/:id`, (req, res, ctx) => {
		const auth = validateAuth(req);

		if (auth.errorMessage) {
			return res(ctx.delay(DELAY), ctx.status(401), ctx.json(auth));
		}
		const id = Number(req.params.id);

		const subject = db.subject.findFirst({
			where: { id: { equals: id } },
		});

		if (!subject) {
			return res(
				ctx.delay(DELAY),
				ctx.status(404),
				ctx.json({
					message: 'Subject not found.',
				})
			);
		}

		return res(ctx.delay(DELAY), ctx.json(subject));
	}),

	// delete subject
	rest.delete(`${API_URL}/subjects/:id`, (req, res, ctx) => {
		const auth = validateAuth(req);

		if (auth.errorMessage) {
			return res(ctx.delay(DELAY), ctx.status(401), ctx.json(auth));
		}
		const id = Number(req.params.id);

		const deletedSubject = db.subject.delete({
			where: { id: { equals: Number(id) } },
		});

		if (!deletedSubject) {
			return res(
				ctx.delay(DELAY),
				ctx.status(404),
				ctx.json({
					message: 'Subject not found.',
				})
			);
		}

		return res(ctx.delay(DELAY), ctx.status(200));
	}),
];
