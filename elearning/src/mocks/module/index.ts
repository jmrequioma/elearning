import { rest } from 'msw';
import { API_URL } from '@/constants';
import { DELAY, DEFAULT_LIMIT, DEFAULT_PAGE } from '@/mocks/constants';
import { db } from '@/mocks/db';
import { validateAuth, extractAccessToken, checkAuth } from '../utils';
import faker from '@faker-js/faker';

export const moduleHandlers = [
	// get modules
	rest.get(`${API_URL}/modules`, (req, res, ctx) => {
		const auth = validateAuth(req);
		if (auth.errorMessage) {
			return res(ctx.delay(DELAY), ctx.status(401), ctx.json(auth));
		}
		const limit = Number(req.url.searchParams.get('limit')) || DEFAULT_LIMIT;
		const page = Number(req.url.searchParams.get('page')) || DEFAULT_PAGE;
		const keyword = req.url.searchParams.get('keyword') || '';
		const published = req.url.searchParams.get('published') || '';
		const courseId = req.url.searchParams.get('courseId') || '';

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

		if (courseId) {
			query = {
				...query,
				courseId: {
					equals: Number(courseId),
				},
			};
		}

		const modules = db.module.findMany({
			take: limit,
			skip,
			where: query,
			orderBy: {
				title: 'asc',
			},
		});

		const totalCount = db.module.count({ where: query });

		const data = modules.map((module) => {
			const course = db.course.findFirst({
				where: { id: { equals: module.courseId } },
			});
			return {
				...module,
				courseTitle: course?.title,
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

	// update module
	rest.patch(`${API_URL}/modules/:id`, (req, res, ctx) => {
		const auth = validateAuth(req);
		if (auth.errorMessage) {
			return res(ctx.delay(DELAY), ctx.status(401), ctx.json(auth));
		}
		const { title, isPublished, duration } = req.body as {
			title: string;
			isPublished: boolean;
			duration: number;
		};
		const id = Number(req.params.id);

		const date = new Date().toISOString();
		const newModule = db.module.update({
			where: { id: { equals: id } },
			data: { title, isPublished, duration: Number(duration), updatedAt: date },
		});

		if (!newModule) {
			return res(
				ctx.delay(DELAY),
				ctx.status(404),
				ctx.json({
					message: 'Module not found.',
				})
			);
		}

		return res(ctx.delay(DELAY), ctx.json(newModule));
	}),

	// delete module
	rest.delete(`${API_URL}/modules/:id`, (req, res, ctx) => {
		const auth = validateAuth(req);
		if (auth.errorMessage) {
			return res(ctx.delay(DELAY), ctx.status(401), ctx.json(auth));
		}
		const id = Number(req.params.id);

		const deletedModule = db.module.delete({
			where: { id: { equals: id } },
		});

		if (!deletedModule) {
			return res(
				ctx.delay(DELAY),
				ctx.status(404),
				ctx.json({
					message: 'Module not found.',
				})
			);
		}

		return res(ctx.delay(DELAY), ctx.status(200));
	}),

	// add module
	rest.post(`${API_URL}/modules`, (req, res, ctx) => {
		const auth = validateAuth(req);
		const accessToken = extractAccessToken(req) as string;
		const loggedInUser = checkAuth(accessToken);
		if (auth.errorMessage) {
			return res(ctx.delay(DELAY), ctx.status(401), ctx.json(auth));
		}

		const data = req.body as {
			courseId: number;
			title: string;
			isPublished: boolean;
			duration: number;
		};

		const existingModule = db.module.findFirst({
			where: {
				title: {
					equals: data.title,
				},
			},
		});

		if (existingModule) {
			return res(
				ctx.delay(DELAY),
				ctx.status(409),
				ctx.json({
					message: 'Title must be unique.',
				})
			);
		}

		const lastId = db.module.count();

		const date = new Date().toISOString();
		const module = db.module.create({
			id: lastId + 1,
			title: data.title,
			duration: data.duration,
			isPublished: true,
			createdAt: date,
			updatedAt: date,
			authorId: loggedInUser?.id,
			courseId: data.courseId,
			contents: [],
		});

		return res(ctx.delay(DELAY), ctx.json(module));
	}),

	// get module details
	rest.get(`${API_URL}/modules/:id`, (req, res, ctx) => {
		const auth = validateAuth(req);

		if (auth.errorMessage) {
			return res(ctx.delay(DELAY), ctx.status(401), ctx.json(auth));
		}
		const id = Number(req.params.id);

		const module = db.module.findFirst({
			where: { id: { equals: id } },
		});

		if (!module) {
			return res(
				ctx.delay(DELAY),
				ctx.status(404),
				ctx.json({
					message: 'Module not found.',
				})
			);
		}

		return res(ctx.delay(DELAY), ctx.json(module));
	}),
];
