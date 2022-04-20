import { rest } from 'msw';
import { API_URL } from '@/constants';
import { DELAY, DEFAULT_LIMIT, DEFAULT_PAGE } from '@/mocks/constants';
import { db } from '@/mocks/db';
import { validateAuth } from '../utils';
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
		const { title, isPublished } = req.body as {
			title: string;
			isPublished: boolean;
		};
		const id = Number(req.params.id);

		const date = new Date().toISOString();
		const newModule = db.module.update({
			where: { id: { equals: id } },
			data: { title, isPublished, updatedAt: date },
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
];
